import { motion } from 'framer-motion';
import { Sprout, Sun, Moon, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Header({ isDark, onToggleDark }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-leaf-600 text-white">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                Yadag
              </span>
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-tight hidden sm:block">
                Worker Onboarding
              </span>
            </div>
          </motion.div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {['Dashboard', 'Workers', 'Farms', 'Compliance'].map((item, i) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  i === 0
                    ? 'bg-leaf-50 dark:bg-leaf-950/50 text-leaf-700 dark:text-leaf-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item}
              </motion.button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              onClick={onToggleDark}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-gray-200 dark:border-gray-800"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center text-white text-xs font-semibold">
                AS
              </div>
            </motion.div>

            <button
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 pt-3"
          >
            {['Dashboard', 'Workers', 'Farms', 'Compliance'].map((item, i) => (
              <button
                key={item}
                className={`block w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  i === 0
                    ? 'bg-leaf-50 dark:bg-leaf-950/50 text-leaf-700 dark:text-leaf-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
}
