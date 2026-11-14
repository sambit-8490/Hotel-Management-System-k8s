import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Rooms from './pages/Rooms.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import CustomerDashboard from './pages/CustomerDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import api from './utils/api.js';
import { authSuccess } from './store/authSlice.js';

function App() {
  const dispatch = useDispatch();
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Restore the session from the httpOnly cookie after a page refresh
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get('/auth/me');
        dispatch(authSuccess({ user: data }));
      } catch (err) {
        // Not logged in or token expired: stay logged out
      } finally {
        setCheckingAuth(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  // Wait until we know the auth state, otherwise ProtectedRoute
  // redirects to /login before the session is restored.
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manager-dashboard"
              element={
                <ProtectedRoute>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-dashboard"
              element={
                <ProtectedRoute>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
