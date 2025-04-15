import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminDashboard from './Components/Admin/Dashboard';
import AdminLayout from './Components/Admin/Layout/AdminLayout';
import CategoryList from './Components/Admin/Categories/CategoryList';
import ProductList from './Components/Admin/Products/ProductList';
import UserList from './Components/Admin/Users/UserList';
import RolesList from './Components/Admin/RolesPermissions/RolesList';
import ProductListPage from './Components/Frontoffice/Products/ProductListPage'; // Import Frontoffice List
import ProductDetailPage from './Components/Frontoffice/Products/ProductDetailPage'; // Import Frontoffice Detail

function App() {
  return (
    <Routes>
      {/* Public Frontoffice Routes */}
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      {/* Add other frontoffice routes like Home, Cart, etc. here */}
      <Route path="/" element={<ProductListPage />} /> {/* Example: Default to product list */}


      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['super_admin', 'product_manager', 'user_manager', 'admin']} />}> {/* Added 'admin' role based on UserForm */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="users" element={<UserList />} />
          <Route path="roles" element={<RolesList />} /> {/* Add RolesList route */}
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
