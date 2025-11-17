
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { navLinks } from '../../constants';
import { Role } from '../../types';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = navLinks[Role.ADMIN];

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col`}>
                <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">EDURA Admin</h1>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                isActive
                                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-white'
                                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-500 focus:outline-none md:hidden">
                         <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 6H20M4 12H20M4 18H11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <div className="flex items-center ml-auto">
                        <span className="mr-4 text-gray-700 dark:text-gray-200">Welcome, {user?.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
