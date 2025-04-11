import React from 'react';


// Remove the placeholder DashboardPage function
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDashboard from './Components/Admin/Dashboard';
import AdminLayout from './Components/Admin/Layout/AdminLayout';

// Then modify your routes
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'product_manager', 'user_manager']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
