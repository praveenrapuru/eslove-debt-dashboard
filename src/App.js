import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";

const Dashboard = lazy(() => import("./components/Dashboard"));
const AgentDashboard = lazy(() => import("./components/AgentDashboard"));
const Cases = lazy(() => import("./components/Cases"));
const Agents = lazy(() => import("./components/Agents"));

const ActivityLog = lazy(() => import("./components/ActivityLog"));

const LoadingFallback = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agent-dashboard"
            element={
              <ProtectedRoute roles={["AGENT"]}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agents"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <Agents />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activity-log"
            element={
              <ProtectedRoute roles={["ADMIN", "AGENT"]}>
                <ActivityLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cases"
            element={
              <ProtectedRoute roles={["AGENT"]}>
                <Cases />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route
            path="/unauthorized"
            element={
              <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  Access Denied 🚫
                </h1>
                <p className="text-gray-600 mb-4">
                  You don’t have permission to view this page.
                </p>
                <a
                  href="/login"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Back to Login
                </a>
              </div>
            }
          />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
