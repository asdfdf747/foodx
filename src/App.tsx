// Full updated content of src/App.tsx (only the excerpt is shown above)
import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import CustomerLogin from "./components/auth/CustomerLogin";
import AdminLogin from "./components/auth/AdminLogin";
import CustomerRegistration from "./components/auth/CustomerRegistration";
import RegistrationSuccess from "./components/auth/RegistrationSuccess";
import { AuthProvider, useAuth } from "./lib/auth-context";
import routes from "tempo-routes";
import { runMigrations } from "./server/db-migration";

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>;
};

function AppRoutes() {
  const { user, loading } = useAuth();
  const [error, setError] = useState(null); // Define setError using useState

  // Run database migrations on app start
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await runMigrations();
      } catch (error) {
        const errorMessage = `Database Initialization Error: ${error.message}`;
        console.error(errorMessage);
        setError(errorMessage); // Use the defined setError
      }
    };

    initializeDatabase();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<CustomerRegistration />} />
          <Route
            path="/registration-success"
            element={<RegistrationSuccess />}
          />

          {/* Protected routes will be added here */}
          <Route
            path="/food/*"
            element={
              <ProtectedRoute>
                <div>Food Routes (to be implemented)</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/progress/*"
            element={
              <ProtectedRoute>
                <div>Progress Routes (to be implemented)</div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reminders"
            element={
              <ProtectedRoute>
                <div>Reminders (to be implemented)</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </>
    </Suspense>
  );
}
