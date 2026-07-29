import { Stack } from 'expo-router';
import { Alert, Platform, View, Text, Image, StyleSheet } from 'react-native';

// Polyfill Alert.alert for Web platform with a beautiful custom modal
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  // Inject premium alert CSS styles once
  const styleId = 'custom-alert-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      @keyframes alertFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes alertScaleIn {
        from { transform: scale(0.95); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      .custom-alert-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(14, 8, 27, 0.7);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        animation: alertFadeIn 0.2s ease-out forwards;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .custom-alert-container {
        background: linear-gradient(135deg, #1e1333 0%, #0e081b 100%);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 20px;
        padding: 24px;
        width: 90%;
        max-width: 380px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        animation: alertScaleIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        color: #fff;
      }
      .custom-alert-title {
        font-size: 17px;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 12px;
        color: #fff;
        text-align: left;
      }
      .custom-alert-message {
        font-size: 13.5px;
        font-weight: 400;
        line-height: 1.5;
        color: #cbbad6;
        margin-bottom: 24px;
        white-space: pre-wrap;
        text-align: left;
      }
      .custom-alert-buttons {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
      }
      .custom-alert-btn {
        padding: 9px 18px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        outline: none;
      }
      .custom-alert-btn-cancel {
        background: rgba(255, 255, 255, 0.08);
        color: #adb5bd;
        border: 1px solid rgba(255, 255, 255, 0.04);
      }
      .custom-alert-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }
      .custom-alert-btn-default {
        background: linear-gradient(135deg, #d80056 0%, #7d1f5e 100%);
        color: #fff;
        box-shadow: 0 4px 12px rgba(216, 0, 86, 0.25);
      }
      .custom-alert-btn-default:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(216, 0, 86, 0.4);
        filter: brightness(1.1);
      }
      .custom-alert-btn:active {
        transform: translateY(1px);
      }
    `;
    document.head.appendChild(style);
  }

  Alert.alert = (title, message, buttons) => {
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';

    const container = document.createElement('div');
    container.className = 'custom-alert-container';

    const titleEl = document.createElement('div');
    titleEl.className = 'custom-alert-title';
    titleEl.innerText = title;
    container.appendChild(titleEl);

    if (message) {
      const messageEl = document.createElement('div');
      messageEl.className = 'custom-alert-message';
      messageEl.innerText = message;
      container.appendChild(messageEl);
    }

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'custom-alert-buttons';

    // Default to OK button if no buttons specified
    const activeButtons = (buttons && buttons.length > 0) ? buttons : [{ text: 'OK' }];

    activeButtons.forEach(btn => {
      const buttonEl = document.createElement('button');
      buttonEl.className = 'custom-alert-btn ' + (btn.style === 'cancel' ? 'custom-alert-btn-cancel' : 'custom-alert-btn-default');
      buttonEl.innerText = btn.text || 'OK';
      buttonEl.onclick = () => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        if (btn.onPress) {
          btn.onPress();
        }
      };
      buttonsContainer.appendChild(buttonEl);
    });

    container.appendChild(buttonsContainer);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
  };
}

const isElectron = Platform.OS === 'web' && 
  typeof window !== 'undefined' && 
  navigator.userAgent.toLowerCase().includes('electron');

const isMac = Platform.OS === 'web' && 
  typeof window !== 'undefined' && 
  navigator.platform.toLowerCase().includes('mac');

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#120e1f' }}>
      {isElectron && (
        <View style={[styles.titleBar, isMac ? styles.titleBarMac : styles.titleBarWin]}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.titleBarLogo} 
          />
          <Text style={styles.titleBarTitle}>Restaurant Scan Pos</Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  titleBar: {
    height: 36,
    backgroundColor: '#120e1f',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    ...Platform.select({
      web: {
        // @ts-ignore
        '-webkit-app-region': 'drag',
        userSelect: 'none',
      },
      default: {},
    }),
  } as any,
  titleBarMac: {
    paddingLeft: 80,
  },
  titleBarWin: {
    paddingLeft: 12,
  },
  titleBarLogo: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
    ...Platform.select({
      web: {
        // @ts-ignore
        '-webkit-app-region': 'no-drag',
      },
      default: {},
    }),
  } as any,
  titleBarTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    ...Platform.select({
      web: {
        // @ts-ignore
        '-webkit-app-region': 'no-drag',
      },
      default: {},
    }),
  } as any
});
