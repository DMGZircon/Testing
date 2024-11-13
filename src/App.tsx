import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Homepage } from './pages/Homepage'; // Import Homepage instead of Hero
import { AdminLogin } from './components/AdminLogin';
import { Admin } from './components/Admin';
import { AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* Wrap AuthProvider inside BrowserRouter */}
        <Routes>
          <Route path="/" element={<Homepage />} /> {/* Render Homepage here */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
