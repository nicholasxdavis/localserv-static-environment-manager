const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const express = require('express');
const portfinder = require('portfinder');

// Keep global references to prevent garbage collection
let mainWindow = null;
let serverInstance = null;

/**
 * Application Window Configuration
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 650,
    height: 520,
    minWidth: 550,
    minHeight: 480,
    frame: false,            // Custom title bar implementation
    titleBarStyle: 'hidden', // Mac compatibility
    backgroundColor: '#09090b',
    title: "Localserv",
    show: false,             // Prevent white flash during render
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: false        // Disable devtools for production feel
    }
  });

  mainWindow.loadFile('index.html');

  // Graceful startup
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

// --- App Lifecycle ---

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Standard Windows behavior: quit when all windows close
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  // Re-create window on dock click (Mac standard)
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// --- Utility: Server Logger ---

function broadcastLog(req, res) {
  if (!mainWindow || mainWindow.isDestroyed()) return;

  const status = res.statusCode;
  let type = 'info';

  // Determine log level based on HTTP status
  if (status >= 400) type = 'error';
  else if (status >= 200 && status < 300) type = 'success';

  const message = `[${status}] ${req.method} ${req.url}`;
  mainWindow.webContents.send('server-log', message, type);
}

// --- IPC Handlers (Backend Logic) ---

// 1. Window Management
ipcMain.handle('minimize-window', () => mainWindow?.minimize());
ipcMain.handle('close-window', () => mainWindow?.close());

// 2. System: Open External
ipcMain.handle('open-external', async (_, url) => {
  await shell.openExternal(url);
});

// 3. System: File Picker
ipcMain.handle('select-target', async () => {
  if (!mainWindow) return { canceled: true };
  
  return await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory', 'openFile'],
    filters: [{ name: 'Web Files', extensions: ['html', 'htm'] }],
    title: 'Select Project Root'
  });
});

// 4. Server: Start
ipcMain.handle('start-server', async (_, targetPath) => {
  // Reset existing instance if exists
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }

  const fs = require('fs');
  let rootDir = targetPath;

  // Fallback: If user selects index.html, serve the parent folder
  try {
    if (fs.statSync(targetPath).isFile()) {
      rootDir = path.dirname(targetPath);
    }
  } catch (err) {
    return { success: false, error: 'Invalid path selected' };
  }

  const appExpress = express();

  // Middleware: Traffic Logger
  appExpress.use((req, res, next) => {
    res.on('finish', () => broadcastLog(req, res));
    next();
  });

  // Serve Static Assets
  appExpress.use(express.static(rootDir));

  try {
    // Find next available port starting at 8000
    portfinder.basePort = 8000;
    const port = await portfinder.getPortPromise();

    serverInstance = appExpress.listen(port, () => {
      const localUrl = `http://localhost:${port}`;
      
      // Auto-launch default browser
      // If specific file selected, open that deep link
      if (fs.statSync(targetPath).isFile()) {
        shell.openExternal(`${localUrl}/${path.basename(targetPath)}`);
      } else {
        shell.openExternal(localUrl);
      }
    });

    return { success: true, port, path: rootDir };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

// 5. Server: Stop
ipcMain.handle('stop-server', async () => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
    return { success: true };
  }
  return { success: false, error: 'Server not running' };
});