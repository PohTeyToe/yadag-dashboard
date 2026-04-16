import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Sun, Moon, Menu, X, LayoutGrid, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';

export type DashboardView = 'table' | 'map';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  view: DashboardView;
  onViewChange: (v: DashboardView) => void;
}

export function Header({ isDark, onToggleDark, view, onViewChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-leaf-600 text-white shadow-sm shadow-leaf-600/30">
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

          <nav className="hidden md:flex items-center gap-1">
            {['Dashboard', 'Workers', 'Farms', 'Compliance'].map((item, i) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                whileTap={{ scale: 0.96 }}
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

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="hidden sm:flex relative items-center bg-gray-100 dark:bg-gray-800/80 rounded-lg p-0.5"
            >
              {(['table', 'map'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => onViewChange(v)}
                  className={`relative px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    view === v ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  aria-label={`Switch to ${v} view`}
                >
                  {view === v && (
                    <motion.span
                      layoutId="view-toggle-pill"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="absolute inset-0 bg-white dark:bg-gray-950 rounded-md shadow-sm"
                    />
                  )}
                  {v === 'table' ? <LayoutGrid className="w-3.5 h-3.5 relative" /> : <MapIcon className="w-3.5 h-3.5 relative" />}
                  <span className="relative capitalize">{v}</span>
                </button>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDark}
              className="relative p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors overflow-hidden"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.span
                    key="sun"
                    initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="block"
                  >
                    <Sun className="w-4 h-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="moon"
                    initial={{ rotate: 90, scale: 0.4, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="block"
                  >
                    <Moon className="w-4 h-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="hidden sm:flex items-center gap-2 pl-2 ml-1 border-l border-gray-200 dark:border-gray-800"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-leaf-400 to-leaf-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm shadow-leaf-500/20">
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

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-800 pt-3 overflow-hidden"
            >
              <div className="flex gap-2 px-1 mb-2">
                {(['table', 'map'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                      onViewChange(v);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      view === v ? 'bg-leaf-50 dark:bg-leaf-950/50 text-leaf-700 dark:text-leaf-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                    }`}
                  >
                    {v === 'table' ? <LayoutGrid className="w-3.5 h-3.5" /> : <MapIcon className="w-3.5 h-3.5" />}
                    <span className="capitalize">{v}</span>
                  </button>
                ))}
              </div>
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
        </AnimatePresence>
      </div>
    </header>
  );
}
