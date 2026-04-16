import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { farms } from '../data/mockData';
import type { FilterState } from '../types';

interface FiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

export function Filters({ filters, onChange }: FiltersProps) {
  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const hasActiveFilters =
    filters.farm !== '' || filters.status !== '' || filters.visaType !== '' || filters.compliance !== '';

  const clearAll = () => {
    onChange({ farm: '', status: '', visaType: '', compliance: '', search: filters.search });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search workers by name..."
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 dark:focus:border-leaf-500 transition-colors"
          />
        </div>

        {/* Filter selects */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filters:</span>
          </div>

          <select
            value={filters.farm}
            onChange={(e) => update('farm', e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 appearance-none cursor-pointer"
          >
            <option value="">All Farms</option>
            {farms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => update('status', e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Expiring">Expiring</option>
          </select>

          <select
            value={filters.visaType}
            onChange={(e) => update('visaType', e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 appearance-none cursor-pointer"
          >
            <option value="">All Visa Types</option>
            <option value="SAWP">SAWP</option>
            <option value="LMIA">LMIA</option>
            <option value="Work Permit">Work Permit</option>
            <option value="TRV">TRV</option>
          </select>

          <select
            value={filters.compliance}
            onChange={(e) => update('compliance', e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-leaf-500/20 focus:border-leaf-500 appearance-none cursor-pointer"
          >
            <option value="">All Compliance</option>
            <option value="complete">Fully Compliant</option>
            <option value="partial">Partially Compliant</option>
            <option value="critical">Critical</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-950/40 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
