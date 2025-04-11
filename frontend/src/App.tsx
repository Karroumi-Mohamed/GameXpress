import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './Components/Admin/Dashboard'; // Import the actual dashboard

function HomePage() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Home Page</h1>
      <nav className="space-x-4">        
        {!user && <Link to="/login" className="text-blue-500 hover:underline">Login</Link>}
        <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard (Protected)</Link>
      </nav>
      {user && (
        <div className="mt-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded w-full max-w-md">
          <h3 className="font-bold">Logged In User:</h3>
          <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(user, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

// Remove the placeholder DashboardPage function


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'product_manager', 'user_manager']} />}>
        <Route path="/dashboard" element={<AdminDashboard />} /> {/* Use AdminDashboard */}
      </Route>

    </Routes>
  );
}

export default App;
