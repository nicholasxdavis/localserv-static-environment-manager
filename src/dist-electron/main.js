"use strict";
const { app, BrowserWindow, dialog, ipcMain, shell } = require("electron");
const path = require("path");
const express = require("express");
const portfinder = require("portfinder");
let mainWindow = null;
let serverInstance = null;
function createWindow() {
  const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
  mainWindow = new BrowserWindow({
    width: 650,
    height: 520,
    minWidth: 550,
    minHeight: 480,
    frame: false,
    // Custom title bar implementation
    titleBarStyle: "hidden",
    // Mac compatibility
    backgroundColor: "#09090b",
    title: "Localserv",
    show: false,
    // Prevent white flash during render
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      devTools: isDev
      // Enable devtools in development
    }
  });
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
function broadcastLog(req, res) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  const status = res.statusCode;
  let type = "info";
  if (status >= 400) type = "error";
  else if (status >= 200 && status < 300) type = "success";
  const message = `[${status}] ${req.method} ${req.url}`;
  mainWindow.webContents.send("server-log", message, type);
}
ipcMain.handle("minimize-window", () => mainWindow == null ? void 0 : mainWindow.minimize());
ipcMain.handle("close-window", () => mainWindow == null ? void 0 : mainWindow.close());
ipcMain.handle("open-external", async (_, url) => {
  await shell.openExternal(url);
});
ipcMain.handle("select-target", async () => {
  if (!mainWindow) return { canceled: true };
  return await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "openFile"],
    filters: [{ name: "Web Files", extensions: ["html", "htm"] }],
    title: "Select Project Root"
  });
});
ipcMain.handle("start-server", async (_, targetPath) => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
  }
  const fs = require("fs");
  let rootDir = targetPath;
  try {
    if (fs.statSync(targetPath).isFile()) {
      rootDir = path.dirname(targetPath);
    }
  } catch (err) {
    return { success: false, error: "Invalid path selected" };
  }
  const appExpress = express();
  appExpress.use((req, res, next) => {
    res.on("finish", () => broadcastLog(req, res));
    next();
  });
  appExpress.use(express.static(rootDir));
  try {
    portfinder.basePort = 8e3;
    const port = await portfinder.getPortPromise();
    serverInstance = appExpress.listen(port, () => {
      const localUrl = `http://localhost:${port}`;
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
ipcMain.handle("stop-server", async () => {
  if (serverInstance) {
    serverInstance.close();
    serverInstance = null;
    return { success: true };
  }
  return { success: false, error: "Server not running" };
});
