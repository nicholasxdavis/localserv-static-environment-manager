const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const express = require('express');
const portfinder = require('portfinder');

// --- Single Instance Enforcement ---
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running, focus it and quit
  app.quit();
} else {
  // Handle when another instance tries to open
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// Keep global references to prevent garbage collection
let mainWindow = null;
let serverInstance = null;

/**
 * Application Window Configuration
 */
function createWindow() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
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
      devTools: isDev,       // Enable devtools in development
      sandbox: false,        // Required for preload script functionality
      webSecurity: true      // Enable web security
    }
  });

  // Load the app - use Vite dev server in development, built files in production
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

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
    const stats = fs.statSync(targetPath);
    if (stats.isFile()) {
      rootDir = path.dirname(targetPath);
    } else if (!stats.isDirectory()) {
      return { success: false, error: 'Selected path is not a valid folder or file. Please choose a directory or HTML file.' };
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return { success: false, error: 'The selected path does not exist. Please choose a valid folder or file.' };
    } else if (err.code === 'EACCES') {
      return { success: false, error: 'Access denied. You may not have permission to access this folder.' };
    }
    return { success: false, error: 'Unable to access the selected path. Please try a different location.' };
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
    let errorMessage = 'Failed to start the server. ';
    if (err.code === 'EADDRINUSE') {
      errorMessage += 'The port is already in use. Please close other applications using port ' + portfinder.basePort + ' or try again.';
    } else if (err.code === 'EACCES') {
      errorMessage += 'Permission denied. You may need administrator privileges to start the server.';
    } else {
      errorMessage += err.message || 'An unexpected error occurred.';
    }
    return { success: false, error: errorMessage };
  }
});

// 5. Server: Stop
ipcMain.handle('stop-server', async () => {
  if (serverInstance) {
    try {
      serverInstance.close();
      serverInstance = null;
      return { success: true };
    } catch (err) {
      return { success: false, error: 'An error occurred while stopping the server. It may have already stopped.' };
    }
  }
  return { success: false, error: 'No server is currently running.' };
});

// --- Cleanup on App Quit ---
app.on('before-quit', () => {
  // Stop server if running
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't crash the app, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the app, just log the error
});

