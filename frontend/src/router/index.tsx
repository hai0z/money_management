import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import HomeLayout from "../components/layout/HomeLayout";
import HomePage from "../pages/Home/HomePage";
import ReportPage from "../pages/Report/ReportPage";
import HistoryPage from "../pages/HistoryPage";
import LoginPage from "../pages/Auth/LoginPage";
import { AuthProvider } from "../contexts/AuthContext";
import { useAuth } from "../contexts/AuthContext";
import WalletPage from "../pages/Wallet/WalletPage";
import AddBudget from "../pages/Budget/AddBudget";
import AddTransaction from "../pages/Transaction/AddTransaction";
import ListBudget from "../pages/Budget/ListBudget";
import Setting from "../pages/Setting/Setting";
import ExpenseAnalysisReport from "../pages/Report/components/ExpenseAnalysisReport";
import IncomeAnalysisReport from "../pages/Report/components/IncomeAnalysisReport";
import IncomeExpenseReport from "../pages/Report/components/IncomeExpenseReport";
import CurrentFinanceReport from "../pages/Report/components/CurrentFinanceReport";
import EditTransaction from "../pages/Transaction/EditTransaction";
import AddWallet from "../pages/Wallet/AddWallet";
import WalletDetail from "../pages/Wallet/WalletDetail";
import BudgetDetail from "../pages/Budget/BudgetDetail";
import EditWallet from "../pages/Wallet/EditWallet";
import UserInfo from "../pages/User/UserInfo";
import EditBudget from "../pages/Budget/EditBudget";
import EditUserInfo from "../pages/User/EditUserInfo";
import ChangePassword from "../pages/User/ChangePassword";
import Register from "../pages/Auth/Register";
import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();

  console.log("isAuthenticated", isAuthenticated);
  // Kiểm tra cả localStorage để đảm bảo trạng thái đăng nhập được duy trì
  const isLoggedIn = isAuthenticated || localStorage.getItem("user") !== null;

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Toaster />
        <LoginPage />
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <Toaster />
        <Register />
      </AuthProvider>
    ),
  },

  {
    path: "/",
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <HomeLayout />
        </ProtectedRoute>
      </AuthProvider>
    ),
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/transactions",
        children: [
          {
            path: "add-transaction",
            element: <AddTransaction />,
          },
          {
            path: "edit-transaction/:id",
            element: <EditTransaction />,
          },
        ],
      },

      {
        path: "/budgets",
        children: [
          {
            path: "/budgets/add",
            element: <AddBudget />,
          },
          {
            path: "/budgets",
            element: <ListBudget />,
          },
          {
            path: "/budgets/:id",
            element: <BudgetDetail />,
          },
          {
            path: "/budgets/edit/:id",
            element: <EditBudget />,
          },
        ],
      },
      {
        path: "/wallet",
        children: [
          {
            path: "/wallet",
            element: <WalletPage />,
          },
          {
            path: "/wallet/add",
            element: <AddWallet />,
          },
          {
            path: "/wallet/:id",
            element: <WalletDetail />,
          },
          {
            path: "/wallet/edit/:id",
            element: <EditWallet />,
          },
        ],
      },
      {
        path: "*",
        element: <HomePage />,
      },
      {
        path: "/report",
        children: [
          {
            path: "/report",
            element: <ReportPage />,
          },
          {
            path: "/report/income-analysis",
            element: <IncomeAnalysisReport />,
          },
          {
            path: "/report/expense-analysis",
            element: <ExpenseAnalysisReport />,
          },
          {
            path: "/report/income-expense",
            element: <IncomeExpenseReport />,
          },
          {
            path: "/report/current-finance",
            element: <CurrentFinanceReport />,
          },
        ],
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },
      {
        path: "/user",
        children: [
          {
            path: "/user",
            element: <UserInfo />,
          },
          {
            path: "/user/edit/:id",
            element: <EditUserInfo />,
          },
          {
            path: "/user/change-password",
            element: <ChangePassword />,
          },
        ],
      },
    ],
  },
]);

export default router;
