const electron = require("electron");

electron.app.on("ready", () => {
  const window = new electron.BrowserWindow({
    minHeight: 768,
    minWidth: 1366,
    height: 768,
    width: 1366,
    center: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.menuBarVisible = false;
  window.loadURL("http://localhost:5173");
});

electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
