import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FarmCards } from './components/FarmCards';
import { ExpiryAlerts } from './components/ExpiryAlerts';
import { Filters } from './components/Filters';
import { WorkerTable } from './components/WorkerTable';
import { useDarkMode } from './hooks/useDarkMode';
import { workers } from './data/mockData';
import { getComplianceScore } from './data/mockData';
import type { FilterState } from './types';

function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [filters, setFilters] = useState<FilterState>({
    farm: '',
    status: '',
    visaType: '',
    compliance: '',
    search: '',
  });

  const filteredWorkers = useMemo(() => {
    return workers.filter((w) => {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white transition-colors">
      <Header isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <StatsBar />

        {/* Farm cards + Expiry alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Farm Overview
              </h2>
              <FarmCards />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Upcoming Expirations
            </h2>
            <ExpiryAlerts />
          </div>
        </div>

        {/* Filters + Worker table */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Worker Management
          </h2>
          <Filters filters={filters} onChange={setFilters} />
          <WorkerTable workers={filteredWorkers} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Yadag Worker Onboarding Dashboard. Demo built by Abdallah Safi for Riipen internship application.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            React 19 + TypeScript + Tailwind CSS v4 + Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
