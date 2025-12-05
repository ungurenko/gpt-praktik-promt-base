import React, { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, NavLink } from 'react-router-dom';
import { ChevronRight, Home, Settings, Sun, Menu, Heart, BookOpen, LayoutGrid, PanelLeftClose, PanelLeftOpen, GalleryHorizontal, MessageCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs = [] }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Theme Logic ---
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    // Default to light (false) if no saved preference, ignoring system preferences
    return saved === 'dark';
  });
  
  // --- Sidebar Collapse State ---
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('sidebar_collapsed', String(newState));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      root.classList.add('dark'); // Add tailwind dark class
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark'); // Remove tailwind dark class
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  // --- Navigation Configuration ---
  const navItems = useMemo(() => [
    { label: 'Промты', to: '/', icon: LayoutGrid, exact: true },
    { label: 'Избранное', to: '/favorites', icon: Heart },
    { label: 'Инструкции', to: '/instructions', icon: BookOpen },
    { label: 'Конструктор каруселей', to: '/carousel', icon: GalleryHorizontal },
  ], []);

  // --- Sidebar Content Component (Memoized) ---
  const SidebarContent = useMemo(() => {
    return (
    <>
      <div className={`flex-none flex items-center ${isCollapsed ? 'justify-center p-4' : 'p-6'}`}>
        <Link to="/" className={`flex items-center gap-3 hover:opacity-70 transition-opacity group ${isCollapsed ? 'justify-center' : ''}`}>
          <div className={`w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${isAdmin ? 'bg-rose-400 shadow-rose-200' : 'bg-stone-800 shadow-stone-200'} group-hover:scale-105 flex-shrink-0`}>
            <span className={`font-bold text-sm ${isAdmin ? 'text-white' : 'text-white dark:text-black'}`}>GP</span>
          </div>
          {!isCollapsed && <span className="font-bold text-lg tracking-tight text-stone-900 dark:text-white whitespace-nowrap transition-opacity">GPT-ПРАКТИК</span>}
        </Link>
      </div>

      <div className={`flex-1 overflow-y-auto py-2 space-y-1 custom-scrollbar ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {!isCollapsed && <div className="text-sm font-bold text-stone-400 uppercase tracking-wider px-4 mb-2 mt-4 transition-opacity">Меню</div>}
        {isCollapsed && <div className="h-4"></div>}
        
        {navItems.map((item) => {
            const content = (isActive: boolean) => (
                <>
                    <item.icon size={22} strokeWidth={2} className={`flex-shrink-0 ${isActive ? 'text-orange-500' : 'text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300'}`} />
                    {!isCollapsed && <span className="whitespace-nowrap text-base">{item.label}</span>}
                    {isActive && !isCollapsed && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-orange-500 rounded-r-full" />}
                </>
            );

            const linkClass = (isActive: boolean) => `
              flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 font-medium text-base group relative
              ${isCollapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-white shadow-sm text-stone-900 dark:bg-white/10 dark:text-white'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white'
              }
            `;

            return (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.exact}
                    className={({ isActive }) => linkClass(isActive)}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    {({ isActive }) => (
                        isCollapsed ? (
                            <Tooltip content={item.label} position="right" className="w-full h-full flex items-center justify-center">
                                {content(isActive)}
                            </Tooltip>
                        ) : (
                            content(isActive)
                        )
                    )}
                </NavLink>
            );
        })}

        {/* Telegram Bot Link */}
        <a
          href="https://t.me/TgOformlenie_bot"
          target="_blank"
          rel="noopener noreferrer"
          className={`
            flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 font-medium text-base group relative
            ${isCollapsed ? 'justify-center' : ''}
            text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-white
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {isCollapsed ? (
            <Tooltip content="Авто-оформление поста в телеграм" position="right" className="w-full h-full flex items-center justify-center">
              <MessageCircle size={22} strokeWidth={2} className="flex-shrink-0 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />
            </Tooltip>
          ) : (
            <>
              <MessageCircle size={22} strokeWidth={2} className="flex-shrink-0 text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300" />
              <span className="whitespace-nowrap text-base">Авто-оформление поста в телеграм</span>
            </>
          )}
        </a>

      </div>

      <div className="p-3 flex-none border-t border-stone-100 dark:border-white/5 flex flex-col gap-2">
        {/* Admin Link */}
        <NavLink
          to="/admin"
          className={({ isActive }) => `
            flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 font-medium text-base group relative
            ${isCollapsed ? 'justify-center' : ''}
            ${isActive 
              ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' 
              : 'text-stone-500 hover:bg-rose-50 hover:text-rose-600 dark:text-stone-400 dark:hover:bg-rose-900/10'
            }
          `}
         >
            {({ isActive }) => isCollapsed ? (
                <Tooltip content="Панель управления" position="right" className="w-full flex items-center justify-center">
                   <Settings size={22} />
                </Tooltip>
            ) : (
                <>
                   <Settings size={20} />
                   <span className="whitespace-nowrap">Панель управления</span>
                </>
            )}
         </NavLink>

         {/* Theme Toggle */}
        <div className={`bg-stone-50 dark:bg-white/5 rounded-2xl p-3 flex items-center group transition-all ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
           {isCollapsed ? (
             <Tooltip content={isDark ? "Светлая тема" : "Темная тема"} position="right">
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-xl hover:bg-white dark:hover:bg-white/10 shadow-sm flex items-center justify-center text-stone-500 dark:text-stone-400 hover:text-orange-500 transition-all"
                >
                    <Sun size={20} />
                </button>
             </Tooltip>
           ) : (
               <>
                   <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white dark:bg-white/10 shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                       <Sun size={16} className="text-orange-500" />
                     </div>
                     <span className="text-sm font-bold text-stone-600 dark:text-stone-300 whitespace-nowrap">Тема</span>
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className="w-12 h-7 rounded-full bg-stone-200 dark:bg-white/20 relative transition-colors"
                   >
                     <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? 'left-6' : 'left-1'}`} />
                   </button>
               </>
           )}
        </div>
      </div>
    </>
    );
  }, [isCollapsed, isDark, isAdmin, navItems]);

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-stone-50/50 dark:bg-[#121212] text-stone-900 dark:text-stone-100 selection:bg-orange-100 selection:text-orange-900">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-stone-900/20 backdrop-blur-sm transition-opacity duration-200 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Sidebar Container - Reduced Blur and Transition Duration */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-white/90 dark:bg-[#1E1E1E]/95 backdrop-blur-md border-r border-stone-200/60 dark:border-white/5 transform transition-all duration-200 ease-in-out flex flex-col will-change-transform
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full'}
        ${isCollapsed ? 'md:w-24' : 'md:w-80'}
      `}>
        {SidebarContent}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Header - Reduced Blur */}
        <header className="flex-none h-16 md:h-24 flex items-center justify-between px-4 md:px-8 border-b border-stone-200/40 dark:border-white/5 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md z-20 sticky top-0 transition-all duration-200">
           <div className="flex items-center gap-3 overflow-hidden">
             {/* Mobile Menu Button */}
             <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-stone-500 hover:text-stone-800 transition-colors">
               <Menu size={28} />
             </button>
             
             {/* Desktop Collapse Button */}
             <button 
                onClick={toggleSidebar} 
                className="hidden md:flex items-center justify-center p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-white/10 rounded-lg transition-all mr-2"
                title={isCollapsed ? "Развернуть меню" : "Свернуть меню"}
             >
                {isCollapsed ? <PanelLeftOpen size={24} /> : <PanelLeftClose size={24} />}
             </button>
             
             {/* Breadcrumbs */}
             <nav className="flex items-center text-base text-stone-400 space-x-2 whitespace-nowrap overflow-hidden mask-image-gradient-r">
                <Link to="/" className="hover:text-stone-800 dark:hover:text-stone-200 transition-colors flex items-center p-1.5 rounded-lg hover:bg-stone-100/50 dark:hover:bg-white/10">
                   <Home size={20} strokeWidth={2} />
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                    {crumb.to ? (
                      <Link to={crumb.to} className="hover:text-stone-900 dark:hover:text-white transition-colors truncate font-medium">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-stone-700 dark:text-stone-300 font-semibold truncate">{crumb.label}</span>
                    )}
                  </React.Fragment>
                ))}
             </nav>
           </div>
           
           {/* Header Actions if needed */}
           <div className="flex items-center gap-3">
           </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-8">
           <div className="max-w-7xl mx-auto pb-24">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;