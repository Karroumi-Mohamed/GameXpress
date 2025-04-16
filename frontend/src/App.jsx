
import { Route, Routes } from 'react-router-dom';
import Login from './Components/Login.jsx';
import Register from './Components/Register.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import AdminDashboard from './Components/Admin/Dashboard.jsx';
import AdminLayout from './Components/Admin/Layout/AdminLayout.jsx';
import CategoryList from './Components/Admin/Categories/CategoryList.jsx';
import ProductList from './Components/Admin/Products/ProductList.jsx';
import UserList from './Components/Admin/Users/UserList.jsx';
import RolesList from './Components/Admin/RolesPermissions/RolesList.jsx';
import ProductListPage from './Components/Frontoffice/Products/ProductListPage.jsx'; // Import Frontoffice List
import ProductDetailPage from './Components/Frontoffice/Products/ProductDetailPage.jsx'; // Import Frontoffice Detail
import FrontOfficeLayout from './Components/Frontoffice/FrontOfficeLayout.jsx';

function App() {
  return (
    <Routes>
      {/* Public Frontoffice Routes */}
      <Route path="/products" element={<FrontOfficeLayout />} />
      <Route path="/products/:slug" element={<ProductDetailPage />} />
      <Route path="/" element={<FrontOfficeLayout />} /> {/* Example: Default to product list */}


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
