const { contextBridge, ipcRenderer } = require('electron');

/**
 * Secure Bridge between Renderer (UI) and Main Process
 */
contextBridge.exposeInMainWorld('api', {
  // System Actions
  minimize: () => ipcRenderer.invoke('minimize-window'),
  close: () => ipcRenderer.invoke('close-window'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  // File System
  selectTarget: () => ipcRenderer.invoke('select-target'),

  // Server Controls
  startServer: (path) => ipcRenderer.invoke('start-server', path),
  stopServer: () => ipcRenderer.invoke('stop-server'),

  // Event Listeners
  onServerLog: (callback) => {
    // Clean up previous listeners to prevent duplicates if called multiple times
    ipcRenderer.removeAllListeners('server-log');
    ipcRenderer.on('server-log', (_, msg, type) => callback(msg, type));
  }
});