import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMail, FiSend, FiLogOut, FiMenu, FiX, FiPlus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
    children: React.ReactNode;
    title: string;
    action?: React.ReactNode;
}

const Layout = ({ children, title, action }: LayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : { name: 'User', email: '' };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Scheduled', icon: FiMail },
        { path: '/sent', label: 'Sent', icon: FiSend },
    ];

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">
            {/* Sidebar */}
            <motion.div
                initial={{ width: 256 }}
                animate={{ width: isSidebarOpen ? 256 : 80 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                className="glass-panel border-r border-gray-800/50 flex flex-col z-20 relative"
            >
                <div className="p-6 flex items-center justify-between">
                    <AnimatePresence mode='wait'>
                        {isSidebarOpen && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent whitespace-nowrap"
                            >
                                ReachInbox
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'text-white shadow-lg shadow-blue-500/10'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                                <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'} relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-gray-200'}`} />
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="relative z-10 font-medium"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
                    <div className={`flex items-center ${isSidebarOpen ? 'mb-4 px-2' : 'justify-center mb-4'}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20 ring-2 ring-gray-800">
                            {user.name?.[0] || 'U'}
                        </div>
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="ml-3 overflow-hidden"
                            >
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </motion.div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200`}
                    >
                        <FiLogOut className={`w-4 h-4 ${isSidebarOpen ? 'mr-3' : ''}`} />
                        {isSidebarOpen && "Log out"}
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]" />
                </div>

                <header className="flex items-center justify-between px-8 py-6 z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
                        <p className="text-gray-500 text-sm mt-1">Manage your campaigns efficiently</p>
                    </div>
                    {action}
                </header>

                <main className="flex-1 overflow-y-auto px-8 pb-8 z-10 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
