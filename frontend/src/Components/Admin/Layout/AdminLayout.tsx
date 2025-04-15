import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  ShieldCheckIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [productSubmenuOpen, setProductSubmenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      name: 'Roles & Permissions',
      icon: ShieldCheckIcon,
      href: '/admin/roles',
      current: location.pathname.includes('/admin/roles')
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      href: '/admin/settings',
      current: location.pathname.includes('/admin/settings')
    }
  ];

  const notifications = [
    { id: 1, title: "New order received", time: "5 minutes ago", read: false },
    { id: 2, title: "Product stock low: Gaming Headset XZ900", time: "1 hour ago", read: false },
    { id: 3, title: "System update completed", time: "3 hours ago", read: true }
  ];

  const toggleSubmenu = () => {
    setProductSubmenuOpen(!productSubmenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
/*
  const handleSearchOpen = () => {
    setSearchOpen(true);
    setNotificationsOpen(false);
  };
*/
  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
    if (searchOpen) setSearchOpen(false);
  };

  /* const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }; */

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 transition-all duration-300`}>
      <header className={`fixed top-0 right-0 w-full lg:w-[calc(100%-16rem)] z-20 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'}`}>
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden rounded-full p-2 bg-white shadow-md text-slate-700 hover:bg-brand-50 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <div className="hidden md:flex items-center relative max-w-md flex-1 mx-4 lg:mx-8">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full rounded-full border border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200 outline-none transition-all"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={handleNotificationsToggle}
                className="rounded-full p-2 bg-white shadow-sm text-slate-600 hover:bg-slate-100 relative"
                title="Notifications"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-white"></span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <ul>
                        {notifications.map(notification => (
                          <li key={notification.id} className={`px-4 py-3 hover:bg-slate-50 border-l-4 ${notification.read ? 'border-transparent' : 'border-brand-500'}`}>
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className={`text-sm ${notification.read ? 'text-slate-600' : 'font-medium text-slate-800'}`}>{notification.title}</p>
                                <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="py-6 text-center text-slate-500">
                        <p>No new notifications</p>
                      </div>
                    )}
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2">
                    <button className="text-sm text-brand-600 hover:text-brand-800 font-medium w-full text-center">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white lg:bg-white/95 backdrop-filter backdrop-blur-lg border-r border-slate-100 w-72 lg:w-64 shadow-lg lg:shadow-md`}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-accent-500">
              <ViewColumnsIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-accent-600">
                GameXpress
              </h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasSubmenu ? (
                  <div>
                    <button
                      onClick={toggleSubmenu}
                      className={`w-full flex justify-between items-center px-4 py-2.5 text-sm font-medium rounded-xl mb-1 transition-all duration-150 ${
                        item.current
                          ? 'bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </div>
                      <ChevronDownIcon
                        className={`h-4 w-4 transition-transform duration-150 ${
                          productSubmenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {productSubmenuOpen && (
                      <div className="ml-7 space-y-1 mt-1 mb-2 animate-fadeIn">
                        {item.submenuItems?.map((subitem) => (
                          <Link
                            key={subitem.name}
                            to={subitem.href}
                            className={`block px-4 py-2 text-sm rounded-lg transition-all duration-100 ${
                              subitem.current
                                ? 'bg-brand-50 text-brand-700 font-medium'
                                : 'text-slate-600 hover:bg-slate-50'
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
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl mb-1 transition-all duration-150 ${
                      item.current
                        ? 'bg-gradient-to-r from-brand-500/10 to-accent-500/10 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`h-5 w-5 mr-3 ${item.current ? 'text-brand-600' : 'text-slate-500'}`} />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="mt-10 px-6">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Shortcuts</h3>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/"
                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-150"
              >
                <HomeIcon className="h-6 w-6 text-slate-600 mb-1" />
                <span className="text-xs text-slate-600 font-medium">Store</span>
              </Link>
              <Link
                to="/admin/products/add"
                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl border border-brand-200 hover:shadow-sm transition-all duration-150"
              >
                <CubeIcon className="h-6 w-6 text-brand-600 mb-1" />
                <span className="text-xs text-brand-700 font-medium">Add Product</span>
              </Link>
              <Link
                to="/admin/products/images"
                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-200 hover:shadow-sm transition-all duration-150"
              >
                <PhotoIcon className="h-6 w-6 text-accent-600 mb-1" />
                <span className="text-xs text-accent-700 font-medium">Images</span>
              </Link>
              <Link
                to="/admin/settings"
                className="flex flex-col items-center justify-center p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-150"
              >
                <Cog6ToothIcon className="h-6 w-6 text-slate-600 mb-1" />
                <span className="text-xs text-slate-600 font-medium">Settings</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full border-t border-slate-100 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-9 w-9 rounded-full overflow-hidden bg-gradient-to-r from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.name} className="h-full w-full object-cover" />
                  ) : (
                    user?.name?.charAt(0).toUpperCase() || 'U'
                  )}
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
              onClick={handleLogout}
              className="rounded-full p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
              title="Sign out"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:pl-64 pt-16 min-h-screen">
        <main className="p-0 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
