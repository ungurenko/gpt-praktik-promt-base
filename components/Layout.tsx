
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home, Settings, Moon, Sun } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
}

const Layout: React.FC<LayoutProps> = ({ children, breadcrumbs = [] }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  // --- Theme Logic ---
  const [isDark, setIsDark] = useState(() => {
    // Initialize state from localStorage or system preference
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Top Navigation Bar - Warm Soft Glassmorphism (Adapts via CSS vars) */}
      <header className="flex-none h-24 flex items-center px-8 sticky top-0 z-20 transition-all duration-300 bg-stone-50/80 backdrop-blur-xl border-b border-stone-200/40">
        <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity mr-10 group">
              <div className={`w-10 h-10 flex items-center justify-center rounded-2xl shadow-lg transition-all duration-300 ${isAdmin ? 'bg-rose-400 shadow-rose-200' : 'bg-stone-800 shadow-stone-200'} group-hover:scale-105`}>
                <span className="font-bold text-sm text-white">GP</span>
              </div>
              <span className="font-medium text-base tracking-tight text-stone-800 hidden sm:block">GPT-ПРАКТИК</span>
            </Link>

            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center text-sm text-stone-400 space-x-2 overflow-hidden whitespace-nowrap">
              <Link to="/" className="hover:text-stone-800 transition-colors flex items-center p-1.5 rounded-lg hover:bg-stone-100/50">
                <Home size={16} strokeWidth={2} />
              </Link>
              {isAdmin && (
                 <>
                  <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                  <Link to="/admin" className="hover:text-rose-600 text-rose-500 font-medium transition-colors">Admin</Link>
                 </>
              )}
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-stone-900 transition-colors truncate max-w-[200px] font-medium">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-stone-700 font-semibold truncate max-w-[300px]">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-stone-400 hover:text-orange-500 hover:bg-stone-100 transition-all"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun size={20} className="fill-orange-500/20" />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Admin Toggle */}
            <div>
               {isAdmin ? (
                 <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-500 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
                   Exit Admin
                 </Link>
               ) : (
                 <Link to="/admin" className="p-2.5 rounded-xl text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-all" title="Admin Panel">
                   <Settings size={20} />
                 </Link>
               )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
