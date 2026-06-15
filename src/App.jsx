import React, { useState } from 'react';
import { 
  Barcode, 
  Edit, 
  XOctagon, 
  Package, 
  FileText, 
  MoveRight, 
  ChevronLeft, 
  Bell, 
  Wifi, 
  Server, 
  User,
  MoreHorizontal,
  Clock
} from 'lucide-react';
import './index.css';

function App() {
  const [activeCategory, setActiveCategory] = useState("SALON");

  // Mock Data
  const orders = [
    { id: 5, table: "Salon 8", time: "17:43", amount: "₺156,00" },
    { id: 4, table: "Salon 10", time: "17:25", amount: "₺269,00" },
    { id: 3, table: "Salon 6", time: "17:14", amount: "₺177,00" },
    { id: 2, table: "Fatih D.", time: "16:52", amount: "₺645,00" },
    { id: 1, table: "Salon 2", time: "16:26", amount: "₺115,00" },
  ];

  const tables = [
    { id: 1, name: "Salon 1", status: "empty" },
    { id: 2, name: "Salon 2", status: "empty" },
    { id: 3, name: "Salon 3", status: "empty" },
    { id: 4, name: "Salon 4", status: "empty" },
    { id: 6, name: "Salon 6", status: "empty" },
    { 
      id: 7, name: "Salon 7", status: "occupied", 
      amount: "₺80.00", user: "Oğuzhan", time: "19:00", people: 4 
    },
    { 
      id: 8, name: "Salon 8", status: "occupied", 
      amount: "₺40.00", user: "Oğuzhan", time: "19:03" 
    },
    { 
      id: 9, name: "Salon 9", status: "special", 
      amount: "₺95.00", user: "Oğuzhan", time: "18:41", people: 2, hasCloud: true 
    },
    { 
      id: 10, name: "Salon 10", status: "occupied", 
      amount: "₺80.00", user: "Oğuzhan", time: "19:03" 
    },
    { id: 11, name: "Salon 11", status: "empty" },
    { id: 12, name: "Salon 12", status: "empty" },
    { id: 14, name: "Salon 14", status: "empty" },
    { 
      id: 141, name: "Salon 14", status: "reserved", 
      subStatus: "Rezerve", hasClock: true 
    },
    { 
      id: 15, name: "Salon 15", status: "occupied", 
      amount: "₺90.00", user: "Oğuzhan", time: "19:03", isLocked: true 
    },
    { id: 16, name: "Salon 16", status: "empty" },
    { id: 17, name: "Salon 17", status: "empty" },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <ChevronLeft size={24} />
            MENULUX <span>Pos</span>
          </div>
          <div className="header-actions">
            <span style={{ fontWeight: 600, letterSpacing: '1px' }}>MASALAR</span>
            <div className="header-btn" style={{ background: 'var(--accent-pink)' }}>
              <Bell size={18} />
              <span className="badge">12</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <div className="header-btn">
            <MoreHorizontal size={18} />
          </div>
          <div className="header-btn">
            <MoreHorizontal size={18} /> {/* Actually some app switch icon */}
            <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', width: '14px' }}>
               <div style={{width: '6px', height: '6px', background: 'white', borderRadius: '1px'}}></div>
               <div style={{width: '6px', height: '6px', background: 'white', borderRadius: '1px'}}></div>
               <div style={{width: '6px', height: '6px', background: 'white', borderRadius: '1px'}}></div>
               <div style={{width: '6px', height: '6px', background: 'white', borderRadius: '1px'}}></div>
            </div>
          </div>
          <div className="status-item">
            <Wifi size={16} />
            <div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>İnternet</div>
              <div style={{ fontWeight: 'bold' }}>BAĞLI</div>
            </div>
          </div>
          <div className="status-item">
            <Server size={16} />
            <div>
              <div style={{ fontSize: '10px', color: '#ccc' }}>Server</div>
              <div style={{ fontWeight: 'bold' }}>BAĞLI</div>
            </div>
          </div>
          <div className="user-profile">
            <User size={20} />
            <div>
              <div style={{ fontWeight: 'bold' }}>Oğuzhan A.</div>
              <div style={{ fontSize: '10px', color: '#ccc', textAlign: 'right' }}>DEĞİŞTİR</div>
            </div>
          </div>
        </div>
      </header>

      <div className="main-content">
        {/* Left Toolbar Sidebar */}
        <div className="sidebar">
          <button className="toolbar-btn">
            <Barcode />
            Barkod
          </button>
          <button className="toolbar-btn">
            <Edit />
            Düzenle
          </button>
          <button className="toolbar-btn">
            <XOctagon />
            İptal
          </button>
          <button className="toolbar-btn">
            <Package />
            Paket
          </button>
          <button className="toolbar-btn">
            <FileText />
            Notlar
          </button>
          <button className="toolbar-btn">
            <MoveRight />
            Taşı
          </button>
        </div>

        {/* Middle Left: Orders Panel */}
        <div className="orders-panel">
          <div className="orders-header">
            5 ADİSYON
          </div>
          <div className="orders-list">
            {orders.map(order => (
              <div className="order-item" key={order.id}>
                <div className="order-badge">{order.id}</div>
                <div className="order-details">
                  <span>{order.table}</span>
                  <span className="order-time">{order.time}</span>
                  <span className="order-price">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="orders-footer">
            <span>TOPLAM</span>
            <span className="price">₺1.362,00</span>
          </div>
        </div>

        {/* Middle: Tables Grid */}
        <div className="tables-panel">
          <div className="tables-header">
            Katlar &gt; <span className="active">Salon</span>
          </div>
          <div className="tables-grid">
            {tables.map((table, idx) => (
              <div className={`table-card ${table.status}`} key={idx}>
                
                <div className="table-name">{table.name}</div>
                
                {table.status === 'empty' ? (
                  <div className="table-status">Boş</div>
                ) : table.status === 'reserved' ? (
                  <>
                    <div className="table-status">{table.subStatus}</div>
                    {table.hasClock && <Clock size={24} style={{ marginTop: '10px', opacity: 0.8 }}/>}
                  </>
                ) : (
                  <>
                    <div className="table-amount">{table.amount}</div>
                    <div className="table-footer-info">
                      <span>{table.user}</span>
                      <span>{table.time}</span>
                    </div>
                  </>
                )}

                {/* Top Right Icons */}
                <div className="table-icon-top">
                  {table.people && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '2px 6px', borderRadius: '10px' }}>
                      <User size={10} />
                      {table.people}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
          <div style={{ position: 'absolute', bottom: 10, width: '100%', textAlign: 'center', fontWeight: 'bold', fontSize: '24px', letterSpacing: '2px', color: '#1a1a1a', zIndex: 0, opacity: 0.1, pointerEvents: 'none' }}>
            MENULUX
          </div>
        </div>

        {/* Right Categories Sidebar */}
        <div className="categories-sidebar">
          <div className="cat-header">MASALAR</div>
          <button className={`cat-btn ${activeCategory === 'DOLU MASALAR' ? 'active' : ''}`} onClick={() => setActiveCategory('DOLU MASALAR')}>
            DOLU MASALAR
          </button>
          <button className={`cat-btn ${activeCategory === 'SALON' ? 'active' : ''}`} onClick={() => setActiveCategory('SALON')}>
            SALON
          </button>
          <button className={`cat-btn ${activeCategory === 'SALON 2' ? 'active' : ''}`} onClick={() => setActiveCategory('SALON 2')}>
            SALON 2
          </button>
          <button className={`cat-btn ${activeCategory === 'TERAS' ? 'active' : ''}`} onClick={() => setActiveCategory('TERAS')}>
            TERAS
          </button>
          <button className={`cat-btn ${activeCategory === 'BAHÇE' ? 'active' : ''}`} onClick={() => setActiveCategory('BAHÇE')}>
            BAHÇE
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
