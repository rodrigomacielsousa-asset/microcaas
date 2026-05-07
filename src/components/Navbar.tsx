import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Rocket, Box, Database, Calculator, Info, ShoppingCart, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { useCart } from '../hooks/useCart';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth, logout } from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

const navItems = [
  { name: 'Sobre', path: '/sobre', icon: Info },
  { name: 'Soluções', path: '/solucoes', icon: Rocket },
  { name: 'MicroCaaS', path: '/microcaas', icon: Box },
  { name: 'Reforma', path: '/reforma', icon: Calculator },
  { name: 'Docs', path: '/docs', icon: Database },
];

export function Navbar() {
  const { count } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-200 dark:border-slate-800 py-3" : "bg-white dark:bg-slate-900 border-transparent py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105 shadow-sm">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none text-slate-800 dark:text-white">Micro<span className="text-indigo-600">CaaS</span></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Accounting Ecosystem</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-semibold transition-colors py-2",
                    location.pathname === item.path 
                      ? "text-indigo-600 border-b-2 border-indigo-600" 
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 max-w-[80px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors py-2">
                  Login
                </Link>
              )}
            </div>
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-800 pl-8">
              <Link 
                to="/carrinho" 
                className="relative p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                    {count}
                  </span>
                )}
              </Link>
              <ThemeToggle />
              <Link 
                to="/publicar" 
                className="btn-primary"
              >
                Publicar MicroCaaS
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-slate-700 dark:text-slate-200 border-b dark:border-slate-800"
                >
                  <item.icon className="w-5 h-5 text-primary-500" />
                  <span>{item.name}</span>
                </Link>
              ))}
              {user ? (
                <div className="flex items-center justify-between px-3 py-4 border-b dark:border-slate-800">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-indigo-600" />
                    <span className="font-medium text-slate-700 dark:text-slate-200">{user.displayName || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-rose-500">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-3 py-4 text-base font-medium text-slate-700 dark:text-slate-200 border-b dark:border-slate-800"
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span>Login</span>
                </Link>
              )}
                <Link
                  to="/publicar"
                  className="block w-full text-center bg-primary-600 text-white px-4 py-3 rounded-xl font-bold"
                >
                  Publicar MicroCaaS
                </Link>
              </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
