const electron = require("electron");
const express = require("express");
const app = express();
const port = 3000;

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const walletRoutes = require("./src/routes/walletRoutes");

app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/wallets", walletRoutes);





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
  app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
  });
});

electron.app.on("window-all-closed", () => {
  electron.app.quit();
});
