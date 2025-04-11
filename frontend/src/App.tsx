import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDashboard from './Components/Admin/Dashboard';
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import CategoryList from './Components/Admin/Categories/CategoryList';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'product_manager', 'user_manager']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
