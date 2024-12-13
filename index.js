const electron = require("electron");
const express = require("express");
const cors = require("cors");

// Import routes
const userRoutes = require("./src/routes/userRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const budgetRoutes = require("./src/routes/budgetRoutes");
const walletRoutes = require("./src/routes/walletRoutes");

const app = express();
const port = 3000;

// Middleware để parse request body
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies with increased limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded bodies with increased limit
app.use(cors());

// Test middleware để log request body
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  next();
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/wallets", walletRoutes);

// Create Express server instance
const server = app.listen(port, () => {
  console.log(`Express server running on port ${port}`);
});

// Create Electron window
let mainWindow;

electron.app.on("ready", () => {
  mainWindow = new electron.BrowserWindow({
    minHeight: 768,
    minWidth: 1366,
    height: 768,
    width: 1366,
    center: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // Thêm partition để giữ lại localStorage giữa các lần khởi động
      partition: "persist:myapp",
    },
  });
  mainWindow.menuBarVisible = false;
  mainWindow.loadURL("http://localhost:5173");
});

electron.app.on("window-all-closed", () => {
  server.close(); // Close Express server when app closes
  electron.app.quit();
});
