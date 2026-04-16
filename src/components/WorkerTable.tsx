import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck2,
  FileX2,
  FileClock,
  FileQuestion,
  CalendarDays,
  Plane,
  SearchX,
} from 'lucide-react';
import { farms, getComplianceScore, getCountryFlag } from '../data/mockData';
import type { Worker, WorkerDocument } from '../types';

interface WorkerTableProps {
  workers: Worker[];
  onSelectWorker: (worker: Worker) => void;
  onClearFilters?: () => void;
}

function DocumentBadge({ doc }: { doc: WorkerDocument }) {
  const config = {
    Complete: {
      icon: FileCheck2,
      className: 'bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400 border-leaf-200 dark:border-leaf-800',
    },
    Pending: {
      icon: FileClock,
      className:
        'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800',
    },
    Missing: {
      icon: FileQuestion,
      className:
        'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800',
    },
    Expired: {
      icon: FileX2,
      className:
        'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800',
    },
  }[doc.status];

  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-medium ${config.className}`}>
      <Icon className="w-3 h-3" />
      <span>{doc.name}</span>
    </div>
  );
}

function ComplianceBar({ score }: { score: number }) {
  const color =
    score === 100
      ? 'bg-leaf-500'
      : score >= 60
      ? 'bg-warning-500'
      : 'bg-danger-500';

  const textColor =
    score === 100
      ? 'text-leaf-700 dark:text-leaf-400'
      : score >= 60
      ? 'text-warning-700 dark:text-warning-400'
      : 'text-danger-700 dark:text-danger-400';

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <span className={`text-xs font-semibold tabular-nums ${textColor}`}>{score}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, string> = {
    Active: 'bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400',
    Pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400',
    Expiring: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
    Unassigned: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  };
  const cls = config[status] || 'bg-gray-100 text-gray-700';
  const dot =
    status === 'Active'
      ? 'bg-leaf-500'
      : status === 'Pending'
      ? 'bg-warning-500'
      : status === 'Expiring'
      ? 'bg-danger-500'
      : 'bg-gray-400';

  const isCritical = status === 'Expiring';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cls} ${
        isCritical ? 'pulse-critical' : ''
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

function VisaBadge({ visa }: { visa: string }) {
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
      {visa}
    </span>
  );
}

export function WorkerTable({ workers, onSelectWorker, onClearFilters }: WorkerTableProps) {
  const farmMap = Object.fromEntries(farms.map((f) => [f.id, f.name]));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Worker Roster</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
          {workers.length} worker{workers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {['Worker', 'Origin', 'Farm Assignment', 'Visa Type', 'Status', 'Compliance', 'Arrival'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout" initial={false}>
              {workers.map((worker, i) => {
                const compliance = getComplianceScore(worker);
                return (
                  <motion.tr
                    key={worker.id}
                    layout
                    layoutId={`worker-${worker.id}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.25 }}
                    whileHover={{ backgroundColor: 'rgba(34, 197, 94, 0.04)' }}
                    className="group border-b border-gray-50 dark:border-gray-800/50 hover:bg-leaf-50/40 dark:hover:bg-leaf-950/20 transition-colors cursor-pointer"
                    onClick={() => onSelectWorker(worker)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-leaf-300 to-leaf-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {worker.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {worker.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{getCountryFlag(worker.countryCode)}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-300">{worker.countryOfOrigin}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {worker.farmId ? farmMap[worker.farmId] : <em className="text-gray-400">Unassigned</em>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <VisaBadge visa={worker.visaType} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={worker.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ComplianceBar score={compliance} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                        {new Date(worker.arrivalDate).toLocaleDateString('en-CA', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
        <AnimatePresence mode="popLayout" initial={false}>
          {workers.map((worker, i) => {
            const compliance = getComplianceScore(worker);
            return (
              <motion.button
                key={worker.id}
                layout
                layoutId={`worker-${worker.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
                onClick={() => onSelectWorker(worker)}
                className="w-full text-left px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-leaf-300 to-leaf-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {worker.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {worker.name}
                        </span>
                        <span className="text-xs">{getCountryFlag(worker.countryCode)}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusBadge status={worker.status} />
                        <VisaBadge visa={worker.visaType} />
                      </div>
                    </div>
                  </div>
                  <ComplianceBar score={compliance} />
                </div>
                <div className="mt-2 flex items-center gap-4 pl-12 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {worker.farmId ? farmMap[worker.farmId] : 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(worker.arrivalDate).toLocaleDateString('en-CA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {workers.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="px-5 py-14 text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 mb-3">
            <SearchX className="w-6 h-6 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No workers match these filters.</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs mx-auto">
            Try broadening your search or selecting a different farm.
          </p>
          {onClearFilters && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClearFilters}
              className="mt-4 px-3 py-1.5 text-xs font-semibold rounded-lg bg-leaf-600 hover:bg-leaf-700 text-white transition-colors"
            >
              Clear filters
            </motion.button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Keep unused DocumentBadge export internal; remove to avoid unused warnings if needed
export { DocumentBadge };
