const { app, BrowserWindow, dialog, nativeTheme, Menu } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');

let mainWindow;
let staticServer;

// MIME types for static server
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'font/eot',
  '.otf': 'font/otf',
};

// Check if dev server is running on http://localhost:8081
function checkDevServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8081', { timeout: 1500 }, (res) => {
      resolve(true); // Any response means the server is active on this port
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Start a native Node.js SPA server to serve production files on a free port
function startStaticServer(distDir) {
  return new Promise((resolve, reject) => {
    staticServer = http.createServer((req, res) => {
      // Clean request URL path
      let cleanUrl = req.url.split('?')[0].split('#')[0];
      let filePath = path.join(distDir, decodeURIComponent(cleanUrl));
      
      fs.stat(filePath, (err, stats) => {
        // If file doesn't exist or is a directory, serve index.html (SPA Fallback)
        if (err || !stats.isFile()) {
          filePath = path.join(distDir, 'index.html');
        }
        
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        
        fs.readFile(filePath, (readErr, content) => {
          if (readErr) {
            res.writeHead(500);
            res.end(`Server Error: ${readErr.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
          }
        });
      });
    });

    staticServer.listen(0, '127.0.0.1', () => {
      const port = staticServer.address().port;
      resolve(port);
    });

    staticServer.on('error', (err) => {
      reject(err);
    });
  });
}

async function createWindow() {
  // Force dark mode for native window elements/menus
  nativeTheme.themeSource = 'dark';

  // Completely disable and remove the application menu bar globally (removes File, Edit, View, Window etc.)
  Menu.setApplicationMenu(null);

  const isWindows = process.platform === 'win32';
  const iconExt = isWindows ? 'ico' : 'png';
  const iconPath = path.join(__dirname, 'assets', 'images', `app_logo_restaurant.${iconExt}`);

  const windowOptions = {
    width: 1280,
    height: 800,
    title: "Restaurant Scan Pos",
    icon: iconPath,
    backgroundColor: '#120e1f',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  };

  // Enable seamless custom title bar overlay for Windows/Mac to match dark UI
  if (process.platform === 'win32' || process.platform === 'darwin') {
    windowOptions.titleBarStyle = 'hidden';
    windowOptions.titleBarOverlay = {
      color: '#120e1f', // Matches deep dark purple app UI background
      symbolColor: '#ffffff', // White symbol color for window controls
      height: 36 // Compact custom height
    };
  }

  mainWindow = new BrowserWindow(windowOptions);

  // Explicitly set the icon (fixes taskbar/titlebar icon override issues on Windows)
  mainWindow.setIcon(iconPath);

  // Prevent web page from changing the window title and keep it locked to "Restaurant Scan Pos"
  mainWindow.on('page-title-updated', (event) => {
    event.preventDefault();
    mainWindow.setTitle("Restaurant Scan Pos");
  });

  // Force title on load completion
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.setTitle("Restaurant Scan Pos");
  });

  const devServerActive = await checkDevServer();

  if (devServerActive) {
    console.log("Expo Web Dev Server is running. Connecting to http://localhost:8081...");
    mainWindow.loadURL('http://localhost:8081');
    // Open DevTools in dev mode
    mainWindow.webContents.openDevTools();
  } else {
    console.log("No active Dev Server detected. Checking for static build...");
    const distPath = path.join(__dirname, 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(indexPath)) {
      dialog.showErrorBox(
        "Static Build Not Found",
        "React Native Web build was not found in the 'dist' directory.\n\n" +
        "Please run:\n" +
        "1. 'npm run web' to start the development server.\n" +
        "OR\n" +
        "2. 'cmd /c npm run build:web' to create a production bundle before running Electron."
      );
      app.quit();
      return;
    }

    try {
      const port = await startStaticServer(distPath);
      mainWindow.loadURL(`http://127.0.0.1:${port}`);
    } catch (err) {
      dialog.showErrorBox("Server Error", "Failed to start local static file server: " + err.message);
      app.quit();
    }
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('will-quit', () => {
  if (staticServer) {
    staticServer.close();
  }
});
