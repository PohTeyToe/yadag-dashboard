import { useEffect, useState, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header, type DashboardView, type NavSection } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FarmCards } from './components/FarmCards';
import { ExpiryAlerts } from './components/ExpiryAlerts';
import { Filters } from './components/Filters';
import { WorkerTable } from './components/WorkerTable';
import { MatchPanel } from './components/MatchPanel';
import { WorkerDrawer } from './components/WorkerDrawer';
import { FarmMap } from './components/FarmMap';
import { DashboardSkeleton } from './components/Skeleton';
import { useDarkMode } from './hooks/useDarkMode';
import { getAssignedWorkers, getComplianceScore } from './data/mockData';
import type { FilterState, Worker } from './types';

function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [view, setView] = useState<DashboardView>('table');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<NavSection>('Dashboard');
  const [filters, setFilters] = useState<FilterState>({
    farm: '',
    status: '',
    visaType: '',
    compliance: '',
    search: '',
  });

  const dashboardRef = useRef<HTMLDivElement>(null);
  const workersRef = useRef<HTMLDivElement>(null);
  const farmsRef = useRef<HTMLDivElement>(null);
  const complianceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 420);
    return () => clearTimeout(t);
  }, []);

  const scrollToSection = (section: NavSection) => {
    const refMap: Record<NavSection, React.RefObject<HTMLDivElement | null>> = {
      Dashboard: dashboardRef,
      Workers: workersRef,
      Farms: farmsRef,
      Compliance: complianceRef,
    };
    const el = refMap[section].current;
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isLoading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top));
        if (visible.length > 0) {
          const section = visible[0].target.getAttribute('data-section') as NavSection | null;
          if (section) setActiveSection(section);
        }
      },
      { rootMargin: '-100px 0px -50% 0px', threshold: 0 }
    );
    [dashboardRef, workersRef, farmsRef, complianceRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, [isLoading, view]);

  const filteredWorkers = useMemo(() => {
    return getAssignedWorkers().filter((w) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (!w.name.toLowerCase().includes(query)) return false;
      }
      if (filters.farm && w.farmId !== filters.farm) return false;
      if (filters.status && w.status !== filters.status) return false;
      if (filters.visaType && w.visaType !== filters.visaType) return false;
      if (filters.compliance) {
        const score = getComplianceScore(w);
        if (filters.compliance === 'complete' && score !== 100) return false;
        if (filters.compliance === 'partial' && (score === 100 || score === 0)) return false;
        if (filters.compliance === 'critical' && score > 40) return false;
      }
      return true;
    });
  }, [filters]);

  const clearFilters = () =>
    setFilters({ farm: '', status: '', visaType: '', compliance: '', search: '' });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-black text-gray-900 dark:text-white transition-colors">
      <Header
        isDark={isDark}
        onToggleDark={() => setIsDark(!isDark)}
        view={view}
        onViewChange={setView}
        activeSection={activeSection}
        onNavClick={scrollToSection}
      />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DashboardSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              <div ref={dashboardRef} data-section="Dashboard" className="space-y-6 scroll-mt-20">
                <StatsBar />
                <MatchPanel />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 space-y-6">
                  <div ref={farmsRef} data-section="Farms" className="scroll-mt-20">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Farm Overview
                    </h2>
                    <FarmCards />
                  </div>
                </div>
                <div ref={complianceRef} data-section="Compliance" className="scroll-mt-20">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                    Upcoming Expirations
                  </h2>
                  <ExpiryAlerts />
                </div>
              </div>

              <div ref={workersRef} data-section="Workers" className="space-y-4 scroll-mt-20">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {view === 'table' ? 'Worker Management' : 'Field View'}
                  </h2>
                </div>

                <AnimatePresence mode="wait">
                  {view === 'table' ? (
                    <motion.div
                      key="table"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-4"
                    >
                      <Filters filters={filters} onChange={setFilters} />
                      <WorkerTable
                        workers={filteredWorkers}
                        onSelectWorker={setSelectedWorker}
                        onClearFilters={clearFilters}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="map"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                    >
                      <FarmMap />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <WorkerDrawer worker={selectedWorker} onClose={() => setSelectedWorker(null)} />

      <footer className="border-t border-gray-200 dark:border-gray-800 mt-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            Built by Abdallah Safi for the Yadag team. Riipen AO April 2026 Cohort.
          </p>
          <a
            href="https://github.com/PohTeyToe/yadag-dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 dark:text-gray-500 hover:text-leaf-600 dark:hover:text-leaf-400 transition-colors"
          >
            github.com/PohTeyToe/yadag-dashboard
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
