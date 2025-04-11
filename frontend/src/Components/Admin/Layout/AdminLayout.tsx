import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  ChartBarIcon,
  ShoppingBagIcon,
  TagIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChevronDownIcon,
  ViewColumnsIcon,
  CubeIcon,
  PhotoIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productSubmenuOpen, setProductSubmenuOpen] = useState(false);

  const navItems = [
    {
      name: 'Dashboard',
      icon: ChartBarIcon,
      href: '/admin',
      current: location.pathname === '/admin'
    },
    {
      name: 'Products',
      icon: ShoppingBagIcon,
      href: '#',
      current: location.pathname.includes('/admin/products'),
      hasSubmenu: true,
      submenuItems: [
        { name: 'All Products', href: '/admin/products', current: location.pathname === '/admin/products' },
        { name: 'Add Product', href: '/admin/products/add', current: location.pathname === '/admin/products/add' },
        { name: 'Product Images', href: '/admin/products/images', current: location.pathname === '/admin/products/images' }
      ]
    },
    {
      name: 'Categories',
      icon: TagIcon,
      href: '/admin/categories',
      current: location.pathname.includes('/admin/categories')
    },
    {
      name: 'Users',
      icon: UsersIcon,
      href: '/admin/users',
      current: location.pathname.includes('/admin/users')
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      current: location.pathname.includes('/admin/settings')
    }
  ];

  const toggleSubmenu = () => {
    setProductSubmenuOpen(!productSubmenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleSidebar}
          className="rounded-full p-2 bg-white shadow-md text-slate-700 hover:bg-brand-50 transition-colors duration-200"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-slate-100 w-72 lg:w-64 shadow-lg lg:shadow-none`}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-center">
            <ViewColumnsIcon className="h-8 w-8 text-brand-500" />
            <h1 className="text-2xl font-bold text-slate-800 ml-3">GameXpress</h1>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          <nav className="mt-2 px-3 space-y-1">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={toggleSubmenu}
                      className={`w-full flex justify-between items-center px-3 py-2.5 text-sm font-medium rounded-lg mb-1 ${
                        item.current
                          ? 'bg-brand-100 text-brand-800'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform ${
                          productSubmenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {productSubmenuOpen && (
                      <div className="ml-7 space-y-1 mt-1 mb-2">
                        {item.submenuItems?.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.href}
                            className={`block px-3 py-2 text-sm rounded-lg ${
                              subitem.current
                                ? 'bg-brand-50 text-brand-700'
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                      item.current
                        ? 'bg-brand-100 text-brand-800'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-8 px-6">
            <h3 className="px-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Quick Links</h3>
            <div className="mt-2 space-y-1">
              <Link
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <HomeIcon className="h-5 w-5 mr-3 text-slate-500" />
                Store Front
              </Link>
              <Link
                to="/admin/products/add"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <CubeIcon className="h-5 w-5 mr-3 text-slate-500" />
                Add Product
              </Link>
              <Link
                to="/admin/products/images"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-slate-100"
              >
                <PhotoIcon className="h-5 w-5 mr-3 text-slate-500" />
                Manage Images
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full border-t border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-500 to-brand-700 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-800 truncate max-w-[9rem]">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500 truncate flex items-center">
                  <ShieldCheckIcon className="h-3 w-3 mr-1" />
                  {user?.roles?.[0]?.name || 'Admin'}
                </p>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-full p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-800"
              title="Sign out"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className={`lg:pl-64 min-h-screen`}>
        <main className="p-0 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
