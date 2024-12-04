import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomeLayout from "../components/layout/HomeLayout";
import HomePage from "../pages/Home/HomePage";
import WalletAccountPage from "../pages/WalletAccountPage";
import ReportPage from "../pages/ReportPage";
import HistoryPage from "../pages/HistoryPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/wallet",
        element: <WalletAccountPage />,
      },
      {
        path: "*",
        element: <HomePage />,
      },
      {
        path: "/report",
        element: <ReportPage />,
      },
      {
        path: "/history",
        element: <HistoryPage />,
      },
    ],
  },
]);

export default router;
