import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://byzcrqeynubhffrhrolh.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Determine if Supabase is properly configured
const isSupabaseConfigured = 
  supabaseAnonKey && 
  supabaseAnonKey !== '' && 
  supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE';

console.log("[Supabase Service] Initializing...", {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  isConfigured: isSupabaseConfigured
});

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn("[Supabase Service] Supabase is NOT configured. All operations will use local-only AsyncStorage fallback.");
} else {
  console.log("[Supabase Service] Supabase successfully initialized.");
}

const canUseSupabase = () => {
  return supabase !== null;
};

export const supabaseService = {
  // Check configuration status
  isConfigured: (): boolean => {
    return canUseSupabase();
  },

  // Auth / Users operations
  getUsers: async (): Promise<any[]> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_users')
          .select('*');
        if (!error && data) {
          const mappedUsers = data.map(u => ({
            accountId: u.account_id,
            username: u.username,
            password: u.password,
            restaurantName: u.restaurant_name
          }));
          await AsyncStorage.setItem('savedUsers', JSON.stringify(mappedUsers));
          return mappedUsers;
        }
      } catch (err) {
        console.warn("Supabase getUsers failed, falling back to local storage", err);
      }
    }
    const local = await AsyncStorage.getItem('savedUsers');
    return local ? JSON.parse(local) : [];
  },

  registerUser: async (user: any, initialTables: any, defaultMenuItems: any): Promise<boolean> => {
    // 1. Local Storage fallback
    try {
      const storedUsers = await AsyncStorage.getItem('savedUsers');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const updatedUsers = [...users, user];
      await AsyncStorage.setItem('savedUsers', JSON.stringify(updatedUsers));
      
      await AsyncStorage.setItem(`savedRestaurantName_${user.accountId}`, user.restaurantName);
      await AsyncStorage.setItem(`savedCurrency_${user.accountId}`, 'UZS');
      await AsyncStorage.setItem(`savedTables_${user.accountId}`, JSON.stringify(initialTables));
      await AsyncStorage.setItem(`savedOrders_${user.accountId}`, JSON.stringify([]));
      await AsyncStorage.setItem(`savedOrderHistory_${user.accountId}`, JSON.stringify([]));
      await AsyncStorage.setItem(`savedMenuItems_${user.accountId}`, JSON.stringify(defaultMenuItems));
    } catch (err) {
      console.error("Local storage register save failed:", err);
    }

    // 2. Supabase write
    if (canUseSupabase()) {
      console.log("[Supabase Service] Attempting to write registration to Supabase database...");
      try {
        const { error: userError } = await supabase!
          .from('restaurant_users')
          .insert({
            account_id: user.accountId,
            username: user.username,
            password: user.password,
            restaurant_name: user.restaurantName,
            currency: 'UZS'
          });
        
        if (userError) {
          console.error("[Supabase Service] Error writing user to table 'restaurant_users':", userError);
          throw userError;
        }
 
        const { error: dataError } = await supabase!
          .from('restaurant_data')
          .insert({
            account_id: user.accountId,
            tables_json: initialTables,
            orders_json: [],
            history_json: [],
            menu_items_json: defaultMenuItems
          });
 
        if (dataError) {
          console.error("[Supabase Service] Error writing data to table 'restaurant_data':", dataError);
          throw dataError;
        }
        
        console.log("[Supabase Service] Supabase database registration successful!");
        return true;
      } catch (err) {
        console.error("Supabase registerUser failed:", err);
        return false;
      }
    } else {
      console.warn("[Supabase Service] Supabase is NOT configured. Saved only locally.");
    }
    return true;
  },

  updateUserProfile: async (accountId: string, username: string, restaurantName: string, password?: string): Promise<boolean> => {
    // 1. Local update
    try {
      const storedUsers = await AsyncStorage.getItem('savedUsers');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const idx = users.findIndex((u: any) => u.accountId === accountId);
        if (idx !== -1) {
          users[idx].username = username;
          users[idx].restaurantName = restaurantName;
          if (password) users[idx].password = password;
          await AsyncStorage.setItem('savedUsers', JSON.stringify(users));
        }
      }
      await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, restaurantName);
    } catch (err) {
      console.error("Local profile update failed:", err);
    }

    // 2. Supabase update
    if (canUseSupabase()) {
      try {
        const updates: any = {
          username,
          restaurant_name: restaurantName,
          updated_at: new Date().toISOString()
        };
        if (password) updates.password = password;

        const { error } = await supabase!
          .from('restaurant_users')
          .update(updates)
          .eq('account_id', accountId);

        if (error) throw error;
      } catch (err) {
        console.error("Supabase updateUserProfile failed:", err);
        return false;
      }
    }
    return true;
  },

  // Restaurant Name
  getRestaurantName: async (accountId: string): Promise<string> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_users')
          .select('restaurant_name')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.restaurant_name) {
          await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, data.restaurant_name);
          return data.restaurant_name;
        }
      } catch (err) {
        console.warn("Supabase getRestaurantName failed", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedRestaurantName_${accountId}`);
    return local || 'MENULUX';
  },

  setRestaurantName: async (accountId: string, name: string): Promise<boolean> => {
    await AsyncStorage.setItem(`savedRestaurantName_${accountId}`, name);
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_users')
          .update({ restaurant_name: name, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setRestaurantName failed:", err);
        return false;
      }
    }
    return true;
  },

  // Currency
  getCurrency: async (accountId: string): Promise<string> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_users')
          .select('currency')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.currency) {
          await AsyncStorage.setItem(`savedCurrency_${accountId}`, data.currency);
          return data.currency;
        }
      } catch (err) {
        console.warn("Supabase getCurrency failed", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedCurrency_${accountId}`);
    return local || 'UZS';
  },

  setCurrency: async (accountId: string, currency: string): Promise<boolean> => {
    await AsyncStorage.setItem(`savedCurrency_${accountId}`, currency);
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_users')
          .update({ currency: currency, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setCurrency failed:", err);
        return false;
      }
    }
    return true;
  },

  // Tables
  getTables: async (accountId: string): Promise<any> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_data')
          .select('tables_json')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.tables_json) {
          await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(data.tables_json));
          return data.tables_json;
        }
      } catch (err) {
        console.warn("Supabase getTables failed, falling back to local storage", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedTables_${accountId}`);
    return local ? JSON.parse(local) : null;
  },

  setTables: async (accountId: string, tables: any): Promise<boolean> => {
    await AsyncStorage.setItem(`savedTables_${accountId}`, JSON.stringify(tables));
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_data')
          .update({ tables_json: tables, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setTables failed:", err);
        return false;
      }
    }
    return true;
  },

  // Menu Items
  getMenuItems: async (accountId: string): Promise<any[]> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_data')
          .select('menu_items_json')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.menu_items_json) {
          await AsyncStorage.setItem(`savedMenuItems_${accountId}`, JSON.stringify(data.menu_items_json));
          return data.menu_items_json;
        }
      } catch (err) {
        console.warn("Supabase getMenuItems failed", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedMenuItems_${accountId}`);
    return local ? JSON.parse(local) : [];
  },

  setMenuItems: async (accountId: string, items: any[]): Promise<boolean> => {
    await AsyncStorage.setItem(`savedMenuItems_${accountId}`, JSON.stringify(items));
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_data')
          .update({ menu_items_json: items, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setMenuItems failed:", err);
        return false;
      }
    }
    return true;
  },

  // Orders
  getOrders: async (accountId: string): Promise<any[]> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_data')
          .select('orders_json')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.orders_json) {
          await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify(data.orders_json));
          return data.orders_json;
        }
      } catch (err) {
        console.warn("Supabase getOrders failed", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedOrders_${accountId}`);
    return local ? JSON.parse(local) : [];
  },

  setOrders: async (accountId: string, orders: any[]): Promise<boolean> => {
    await AsyncStorage.setItem(`savedOrders_${accountId}`, JSON.stringify(orders));
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_data')
          .update({ orders_json: orders, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setOrders failed:", err);
        return false;
      }
    }
    return true;
  },

  // Order History
  getOrderHistory: async (accountId: string): Promise<any[]> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_data')
          .select('history_json')
          .eq('account_id', accountId)
          .single();
        if (!error && data && data.history_json) {
          await AsyncStorage.setItem(`savedOrderHistory_${accountId}`, JSON.stringify(data.history_json));
          return data.history_json;
        }
      } catch (err) {
        console.warn("Supabase getOrderHistory failed", err);
      }
    }
    const local = await AsyncStorage.getItem(`savedOrderHistory_${accountId}`);
    return local ? JSON.parse(local) : [];
  },

  setOrderHistory: async (accountId: string, history: any[]): Promise<boolean> => {
    await AsyncStorage.setItem(`savedOrderHistory_${accountId}`, JSON.stringify(history));
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_data')
          .update({ history_json: history, updated_at: new Date().toISOString() })
          .eq('account_id', accountId);
        if (error) throw error;
      } catch (err) {
        console.error("Supabase setOrderHistory failed:", err);
        return false;
      }
    }
    return true;
  },

  // Waiters Operations
  getWaiters: async (accountId: string): Promise<any[]> => {
    if (canUseSupabase()) {
      try {
        const { data, error } = await supabase!
          .from('restaurant_waiters')
          .select('*')
          .eq('account_id', accountId)
          .order('created_at', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const mappedWaiters = data.map(w => ({
            id: w.id,
            accountId: w.account_id,
            name: w.name,
            phone: w.phone || '',
            status: w.status || 'active',
            createdAt: w.created_at
          }));
          await AsyncStorage.setItem(`savedWaiters_${accountId}`, JSON.stringify(mappedWaiters));
          return mappedWaiters;
        }
      } catch (err: any) {
        console.warn("Supabase getWaiters failed, falling back to local storage", err.message || err);
      }
    }
    const local = await AsyncStorage.getItem(`savedWaiters_${accountId}`);
    return local ? JSON.parse(local) : [];
  },

  addWaiter: async (accountId: string, name: string, phone: string): Promise<boolean> => {
    const localWaiter = {
      id: 'waiter_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      accountId,
      name,
      phone,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // 1. Local update
    try {
      const storedWaiters = await AsyncStorage.getItem(`savedWaiters_${accountId}`);
      const waiters = storedWaiters ? JSON.parse(storedWaiters) : [];
      waiters.push(localWaiter);
      await AsyncStorage.setItem(`savedWaiters_${accountId}`, JSON.stringify(waiters));
    } catch (err) {
      console.error("Local storage addWaiter failed:", err);
    }

    // 2. Supabase update
    if (canUseSupabase()) {
      try {
        const { error } = await supabase!
          .from('restaurant_waiters')
          .insert({
            account_id: accountId,
            name,
            phone,
            status: 'active'
          });
        if (error) throw error;
      } catch (err) {
        console.error("Supabase addWaiter failed:", err);
        return false;
      }
    }
    return true;
  },

  updateWaiter: async (accountId: string, waiterId: string, name: string, phone: string, status: string): Promise<boolean> => {
    // 1. Local update
    try {
      const storedWaiters = await AsyncStorage.getItem(`savedWaiters_${accountId}`);
      if (storedWaiters) {
        const waiters = JSON.parse(storedWaiters);
        const idx = waiters.findIndex((w: any) => w.id === waiterId);
        if (idx !== -1) {
          waiters[idx].name = name;
          waiters[idx].phone = phone;
          waiters[idx].status = status;
          await AsyncStorage.setItem(`savedWaiters_${accountId}`, JSON.stringify(waiters));
        }
      }
    } catch (err) {
      console.error("Local storage updateWaiter failed:", err);
    }

    // 2. Supabase update
    if (canUseSupabase()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(waiterId);
        if (isUuid) {
          const { error } = await supabase!
            .from('restaurant_waiters')
            .update({ name, phone, status })
            .eq('id', waiterId);
          if (error) throw error;
        } else {
          // Fallback update by name and account_id
          const { error } = await supabase!
            .from('restaurant_waiters')
            .update({ name, phone, status })
            .eq('account_id', accountId)
            .eq('name', name);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Supabase updateWaiter failed:", err);
        return false;
      }
    }
    return true;
  },

  deleteWaiter: async (accountId: string, waiterId: string, waiterName: string): Promise<boolean> => {
    // 1. Local update
    try {
      const storedWaiters = await AsyncStorage.getItem(`savedWaiters_${accountId}`);
      if (storedWaiters) {
        const waiters = JSON.parse(storedWaiters);
        const filtered = waiters.filter((w: any) => w.id !== waiterId);
        await AsyncStorage.setItem(`savedWaiters_${accountId}`, JSON.stringify(filtered));
      }
    } catch (err) {
      console.error("Local storage deleteWaiter failed:", err);
    }

    // 2. Supabase update
    if (canUseSupabase()) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(waiterId);
        if (isUuid) {
          const { error } = await supabase!
            .from('restaurant_waiters')
            .delete()
            .eq('id', waiterId);
          if (error) throw error;
        } else {
          const { error } = await supabase!
            .from('restaurant_waiters')
            .delete()
            .eq('account_id', accountId)
            .eq('name', waiterName);
          if (error) throw error;
        }
      } catch (err) {
        console.error("Supabase deleteWaiter failed:", err);
        return false;
      }
    }
    return true;
  },
};
