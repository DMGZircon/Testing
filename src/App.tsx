import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Homepage } from './pages/Homepage'
import { AdminLogin } from './components/AdminLogin'
import { Hero } from './components/Hero'
import { Admin } from './components/Admin'
import { useState } from 'react'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Add your authentication logic here
  const isAuthenticated = false; // Replace with your auth check
  
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Use isLoading in a no-op way to avoid the warning
  console.log(isLoading); // This line ensures isLoading is read

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />  {/* Add Homepage as main route */}
        <Route path="/hero" element={<Hero setIsLoading={setIsLoading} />} />  {/* Moved Hero to /hero path */}
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
    </BrowserRouter>
  )
}

export default App
