import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  FileCheck2,
  FileX2,
  FileClock,
  FileQuestion,
  CalendarDays,
  Plane,
} from 'lucide-react';
import { farms, getComplianceScore, getCountryFlag } from '../data/mockData';
import type { Worker, WorkerDocument } from '../types';

interface WorkerTableProps {
  workers: Worker[];
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
      {doc.expiryDate && (
        <span className="opacity-60 text-[10px]">
          ({new Date(doc.expiryDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })})
        </span>
      )}
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
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{score}%</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    Active: 'bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400',
    Pending: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400',
    Expiring: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
  }[status] || 'bg-gray-100 text-gray-700';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config}`}>
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'Active' ? 'bg-leaf-500' : status === 'Pending' ? 'bg-warning-500' : 'bg-danger-500'
        }`}
      />
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

export function WorkerTable({ workers }: WorkerTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const farmMap = Object.fromEntries(farms.map((f) => [f.id, f.name]));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Worker Roster</h2>
        <span className="text-xs text-gray-500 dark:text-gray-400">
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
              <th className="px-5 py-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {workers.map((worker) => {
              const compliance = getComplianceScore(worker);
              const isExpanded = expandedId === worker.id;
              return (
                <motion.tr
                  key={worker.id}
                  layout
                  className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : worker.id)}
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
                    <span className="text-sm text-gray-600 dark:text-gray-300">{farmMap[worker.farmId]}</span>
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
                  <td className="px-5 py-3.5">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {/* Expanded document view */}
        <AnimatePresence>
          {expandedId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 px-5 py-4"
            >
              {(() => {
                const worker = workers.find((w) => w.id === expandedId);
                if (!worker) return null;
                return (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      Document Compliance for {worker.name}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {worker.documents.map((doc) => (
                        <DocumentBadge key={doc.name} doc={doc} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile cards */}
      <div className="lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {workers.map((worker) => {
          const compliance = getComplianceScore(worker);
          const isExpanded = expandedId === worker.id;
          return (
            <div key={worker.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : worker.id)}
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
                    {farmMap[worker.farmId]}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(worker.arrivalDate).toLocaleDateString('en-CA', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-gray-50/50 dark:bg-gray-800/30 px-4 py-3 border-t border-gray-100 dark:border-gray-800"
                  >
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                      Documents
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.documents.map((doc) => (
                        <DocumentBadge key={doc.name} doc={doc} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {workers.length === 0 && (
        <div className="px-5 py-12 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-2">
            <FileX2 className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">No workers match your filters.</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search criteria.</p>
        </div>
      )}
    </motion.div>
  );
}
