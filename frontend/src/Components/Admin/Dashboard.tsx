import React, { useState, useEffect } from 'react';
import api from '../../lib/axios'; // Assuming correct path
import { useAuth } from '../../context/AuthContext'; // Assuming correct path
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, Label
} from 'recharts';
import {
  CubeIcon, TagIcon, UsersIcon, ExclamationTriangleIcon, NoSymbolIcon,
  ClockIcon, CheckCircleIcon, CubeTransparentIcon, ShoppingCartIcon,
  CalendarDaysIcon, ChartBarIcon, ChartPieIcon, BellAlertIcon, ListBulletIcon, ViewColumnsIcon // Added more icons
} from '@heroicons/react/24/outline'; // Using outline icons

// Interface definitions (keep as they are)
interface Product {
  id: number;
  name: string;
  stock: number;
  category?: {
    id: number;
    name: string;
  };
  price: number;
  status: string;
  created_at: string;
}

interface DashboardStats {
  total_products: number;
  total_categories: number;
  total_users: number;
  low_stock_products: number;
  out_of_stock_products: number;
  recent_products: Product[];
  stock_alerts: Product[];
}

// Helper to format numbers (optional)
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-US');
};

// --- Stat Card Component ---
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType; // Use ElementType for component icons
  colorClass?: string; // e.g., 'brand', 'accent', 'danger'
  description?: string; // Optional description or comparison
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass = 'brand',
  description
}) => {
  // Map colorClass to Tailwind classes
  const colorMap: Record<string, { text: string; bgGradient: string }> = {
    brand: { text: 'text-brand-600', bgGradient: 'from-brand-100 to-brand-200' },
    accent: { text: 'text-accent-600', bgGradient: 'from-accent-100 to-accent-200' },
    blue: { text: 'text-blue-600', bgGradient: 'from-blue-100 to-blue-200' },
    warning: { text: 'text-warning-600', bgGradient: 'from-warning-100 to-warning-200' },
    danger: { text: 'text-danger-600', bgGradient: 'from-danger-100 to-danger-200' },
    success: { text: 'text-success-600', bgGradient: 'from-success-100 to-success-200' },
  };

  const { text, bgGradient } = colorMap[colorClass] || colorMap.brand;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] border border-slate-100">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <dt className="text-sm font-medium text-slate-500 mb-1">{title}</dt>
          <dd className="text-3xl font-bold tracking-tight text-slate-900">{value}</dd>
          {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        </div>
        <div className={`flex-shrink-0 rounded-full p-3 bg-gradient-to-br ${bgGradient}`}>
          <Icon className={`h-6 w-6 ${text}`} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get<DashboardStats>('/admin/dashboard');
        setStats(response.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // --- Loading State ---
  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-10 bg-gradient-to-br from-slate-50 to-indigo-100">
            <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-brand-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg font-medium text-slate-600">Loading Dashboard...</p>
            </div>
        </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="p-10 bg-gradient-to-br from-red-50 to-red-100 min-h-screen">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-lg mx-auto text-center">
          <NoSymbolIcon className="h-12 w-12 text-danger-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-danger-700 mb-2">Loading Error</h2>
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => window.location.reload()} // Simple reload action
            className="mt-6 px-4 py-2 bg-danger-500 text-white rounded-lg hover:bg-danger-600 transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- No Data State ---
  if (!stats) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)] p-10 bg-gradient-to-br from-slate-50 to-indigo-100">
            <div className="flex flex-col items-center text-center">
                <CubeTransparentIcon className="h-16 w-16 text-slate-400 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-600 mb-2">No Dashboard Data</h2>
                <p className="text-slate-500 max-w-sm">We couldn't find any data to display on the dashboard right now. Please check back later or ensure data sources are active.</p>
            </div>
        </div>
    );
  }

  // Calculate 'In Stock' count safely
  const inStockCount = Math.max(0, stats.total_products - stats.low_stock_products - stats.out_of_stock_products);

  // Prepare data for charts
  const overviewChartData = [
    { name: 'Products', count: stats.total_products, color: 'var(--color-brand-500)' },
    { name: 'Categories', count: stats.total_categories, color: 'var(--color-accent-500)' },
    { name: 'Users', count: stats.total_users, color: 'var(--color-blue-500)' },
  ];

  const stockPieData = [
    { name: 'In Stock', value: inStockCount, color: 'var(--color-success-500)' },
    { name: 'Low Stock', value: stats.low_stock_products, color: 'var(--color-warning-500)' },
    { name: 'Out of Stock', value: stats.out_of_stock_products, color: 'var(--color-danger-500)' }
  ];

  const stockStatusChartData = [
      {
          name: 'Stock Status',
          inStock: inStockCount,
          lowStock: stats.low_stock_products,
          outOfStock: stats.out_of_stock_products
      }
  ];

  const stockAlertChartData = stats.stock_alerts.map(product => ({
    name: product.name.length > 18 ? product.name.substring(0, 18) + '...' : product.name, // Slightly longer substring
    stock: product.stock,
    id: product.id,
    fullName: product.name,
    fill: product.stock <= 5 ? 'url(#gradientDanger)' : 'url(#gradientWarning)' // Use gradients
  }));

  // --- Render Dashboard ---
  return (
    <div className="p-6 md:p-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="mt-1 text-lg text-slate-600">Welcome back, <span className="font-medium text-brand-600">{user?.name || 'Admin'}</span>!</p>
        </div>
        <div className="mt-4 md:mt-0 bg-white rounded-lg px-4 py-2 shadow-sm border border-slate-200 flex items-center text-slate-700 text-sm">
          <CalendarDaysIcon className="h-5 w-5 mr-2 text-slate-400" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-12">
        <StatCard title="Total Products" value={formatNumber(stats.total_products)} icon={ShoppingCartIcon} colorClass="brand" />
        <StatCard title="Total Categories" value={formatNumber(stats.total_categories)} icon={TagIcon} colorClass="accent" />
        <StatCard title="Total Users" value={formatNumber(stats.total_users)} icon={UsersIcon} colorClass="blue" />
        <StatCard title="Low Stock" value={formatNumber(stats.low_stock_products)} icon={ExclamationTriangleIcon} colorClass="warning" />
        <StatCard title="Out of Stock" value={formatNumber(stats.out_of_stock_products)} icon={NoSymbolIcon} colorClass="danger" />
      </dl>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Store Overview Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-brand-500" /> Store Overview
            </h2>
            <div className="bg-slate-100 rounded-md px-3 py-1 text-xs font-medium text-slate-600">
              Current Totals
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={overviewChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }} barGap={15}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={40} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(5px)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  padding: '8px 12px',
                }}
                itemStyle={{ color: '#334155', fontSize: '12px' }}
                labelStyle={{ color: '#0f172a', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} >
                {overviewChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={
                        index === 0 ? 'rgb(255, 90, 31)' : // brand-500
                        index === 1 ? 'rgb(139, 92, 246)' : // accent-500
                        'rgb(59, 130, 246)' // blue-500
                    } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-1"> {/* Reduced bottom margin */}
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ChartPieIcon className="h-6 w-6 mr-2 text-indigo-500" /> Stock Distribution
            </h2>
            <div className="bg-slate-100 rounded-md px-3 py-1 text-xs font-medium text-slate-600">
              Current Status
            </div>
          </div>
           <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={stockPieData}
                cx="50%"
                cy="50%"
                innerRadius={80} // Slightly larger inner radius
                outerRadius={130} // Slightly larger outer radius
                paddingAngle={3}
                dataKey="value"
                stroke="rgba(255, 255, 255, 0.5)" // Add a subtle stroke between slices
                strokeWidth={1}
              >
                 {stockPieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={
                        index === 0 ? 'rgb(16, 185, 129)' : // success-500
                        index === 1 ? 'rgb(245, 158, 11)' : // warning-500
                        'rgb(239, 68, 68)' // danger-500
                    } />
                ))}
                {/* Optional: Label in the center */}
                 <Label
                    value={`${stats.total_products} Total`}
                    position="center"
                    fill="#334155" // slate-700
                    fontSize="16px"
                    fontWeight="600"
                    dy={-5} // Adjust vertical position
                 />
                 <Label
                    value="Products"
                    position="center"
                    fill="#64748b" // slate-500
                    fontSize="12px"
                    dy={15} // Adjust vertical position
                />
              </Pie>
              <Tooltip
                 contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                }}
                itemStyle={{ color: '#334155', fontSize: '12px' }}
                formatter={(value: number, name: string) => [`${formatNumber(value)} Products`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={50} // Increased height for better spacing
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '20px' }} // Add padding top
                formatter={(value, entry) => <span className="text-slate-600 text-sm ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>


        {/* Stock Alert Levels Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 lg:col-span-2"> {/* Span across two columns on large screens */}
           <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                 <BellAlertIcon className="h-6 w-6 mr-2 text-warning-500" /> Stock Alert Levels
             </h2>
             <div className="bg-slate-100 rounded-md px-3 py-1 text-xs font-medium text-slate-600">
                 Low & Critical Items
             </div>
           </div>
           {stats.stock_alerts.length > 0 ? (
             <ResponsiveContainer width="100%" height={400}>
               <BarChart
                 data={stockAlertChartData}
                 margin={{ top: 5, right: 5, left: 5, bottom: 85 }} // Increased bottom margin for rotated labels
                 barSize={30} // Adjust bar size
               >
                    {/* Gradients already defined above */}
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                 <XAxis
                    dataKey="name"
                    interval={0} // Show all labels
                    angle={-55} // Rotate labels
                    textAnchor="end" // Align text to the end after rotation
                    height={100} // Allocate more height
                    tick={{ fontSize: 11, fill: '#64748b' }} // Smaller font size
                    axisLine={false}
                    tickLine={false}
                 />
                 <YAxis
                   axisLine={false}
                   tickLine={false}
                   width={40}
                   tick={{ fill: '#64748b', fontSize: 12 }}
                   label={{
                     value: 'Stock Level',
                     angle: -90,
                     position: 'insideLeft',
                     offset: -5,
                     style: { textAnchor: 'middle', fill: '#64748b', fontSize: 13 }
                   }}
                 />
                 <Tooltip
                   cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }}
                   contentStyle={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        padding: '8px 12px',
                    }}
                    itemStyle={{ color: '#334155', fontSize: '12px' }}
                    labelStyle={{ color: '#0f172a', fontWeight: '600', marginBottom: '4px', fontSize: '13px' }}
                   labelFormatter={(label, items) => {
                     // Find the full name from the original data
                     const product = stats.stock_alerts.find(p => p.id === items[0]?.payload?.id);
                     return product ? product.name : label;
                   }}
                   formatter={(value: number) => [`${value} units`, 'Current Stock']}
                 />
                 <Bar
                   dataKey="stock"
                   background={{ fill: '#f1f5f9', radius: 4 }} // slate-100 background
                   radius={[6, 6, 0, 0]}
                 >
                    {/* Cells now use the fill defined in stockAlertChartData */}
                 </Bar>
                 <ReferenceLine y={5} stroke={`rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-danger-500')})`} strokeDasharray="4 4" strokeWidth={1.5}>
                   <Label
                     value="Critical Level (<=5)"
                     position="insideTopLeft"
                     fill={`rgb(${getComputedStyle(document.documentElement).getPropertyValue('--color-danger-500')})`} // danger-500
                     fontSize={11}
                     fontWeight="500"
                     dy={-5} // Adjust position slightly
                   />
                 </ReferenceLine>
               </BarChart>
             </ResponsiveContainer>
           ) : (
             <div className="py-16 text-center rounded-lg bg-slate-50 border border-dashed border-slate-300">
               <CheckCircleIcon className="mx-auto h-14 w-14 text-success-400" />
               <p className="mt-4 text-lg font-medium text-slate-700">All Clear!</p>
               <p className="text-sm text-slate-500">No products are currently low on stock.</p>
             </div>
           )}
         </div>
      </div>

      {/* Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Products List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <ListBulletIcon className="h-6 w-6 mr-2 text-brand-500" /> Recent Products
            </h2>
            <button className="text-sm text-brand-600 hover:text-brand-800 font-medium transition duration-200">
              View All
            </button>
          </div>
          {stats.recent_products.length > 0 ? (
            <ul className="space-y-3">
              {stats.recent_products.slice(0, 5).map((product) => ( // Limit to 5 for preview
                <li key={product.id} className="flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 hover:bg-brand-50/50">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg flex items-center justify-center">
                    <CubeIcon className="h-5 w-5 text-brand-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate" title={product.name}>{product.name}</p>
                    <p className="text-xs text-slate-500 flex items-center flex-wrap gap-x-1.5">
                      <span>{product.category?.name || 'Uncategorized'}</span>
                      <span className="text-slate-300">•</span>
                      <span>${product.price?.toFixed(2) || '0.00'}</span>
                       <span className="text-slate-300">•</span>
                       <span className="inline-flex items-center">
                         <ClockIcon className="h-3 w-3 mr-1 text-slate-400"/>
                         {new Date(product.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                       </span>
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'available' ? 'bg-success-100 text-success-700' :
                      product.status === 'out_of_stock' ? 'bg-danger-100 text-danger-700' :
                      'bg-warning-100 text-warning-700' // Assuming 'low_stock' or similar might be a status
                    }`}>
                      {product.status.replace('_', ' ')} {/* Improve readability */}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="py-16 text-center rounded-lg bg-slate-50 border border-dashed border-slate-300">
               <ShoppingCartIcon className="mx-auto h-14 w-14 text-slate-400" />
               <p className="mt-4 text-lg font-medium text-slate-700">No Recent Products</p>
               <p className="text-sm text-slate-500">Newly added products will appear here.</p>
             </div>
          )}
        </div>

        {/* Stock Alerts List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-semibold text-slate-900 flex items-center">
                <BellAlertIcon className="h-6 w-6 mr-2 text-warning-500" /> Stock Alerts
            </h2>
            <button className="text-sm text-brand-600 hover:text-brand-800 font-medium transition duration-200">
              Manage Stock
            </button>
          </div>
          {stats.stock_alerts.length > 0 ? (
            <ul className="space-y-3">
              {stats.stock_alerts.slice(0, 5).map((product) => ( // Limit to 5 for preview
                <li key={product.id} className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${product.stock <= 5 ? 'hover:bg-danger-50/50' : 'hover:bg-warning-50/50'}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${product.stock <= 5 ? 'bg-gradient-to-br from-danger-100 to-danger-200' : 'bg-gradient-to-br from-warning-100 to-warning-200'}`}>
                     <ExclamationTriangleIcon className={`h-5 w-5 ${product.stock <= 5 ? 'text-danger-600' : 'text-warning-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate" title={product.name}>{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 text-sm font-semibold px-3 py-1 rounded-full ${product.stock <= 5 ? 'bg-danger-100 text-danger-700' : 'bg-warning-100 text-warning-700'}`}>
                    Stock: {product.stock}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="py-16 text-center rounded-lg bg-slate-50 border border-dashed border-slate-300">
               <CheckCircleIcon className="mx-auto h-14 w-14 text-success-400" />
               <p className="mt-4 text-lg font-medium text-slate-700">All Clear!</p>
               <p className="text-sm text-slate-500">No products are currently low on stock.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;