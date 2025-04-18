
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AdminDashboard from './Components/Admin/Dashboard.jsx';
import AdminLayout from './Components/Admin/Layout/AdminLayout.jsx';
import CategoryList from './Components/Admin/Categories/CategoryList.jsx';
import ProductList from './Components/Admin/Products/ProductList.jsx';
import UserList from './Components/Admin/Users/UserList.jsx';
import RolesPermissionsPage from './Components/Admin/RolesPermissions/RolesPermissionsPage.jsx';
import ProductDetailPage from './Components/Frontoffice/Products/ProductDetailPage.jsx';
import FrontOfficeLayout from './Components/Frontoffice/FrontOfficeLayout.jsx';

function App() {
  return (
    <Routes>
      <Route path="/products" element={<FrontOfficeLayout />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/" element={<FrontOfficeLayout />} />


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'product_manager', 'user_manager', 'admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="roles" element={<RolesPermissionsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
