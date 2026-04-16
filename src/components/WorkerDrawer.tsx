import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileCheck2,
  FileClock,
  FileX2,
  FileQuestion,
  CalendarDays,
  MapPin,
  Languages,
  Building2,
  History,
  Activity,
  TrendingUp,
  RefreshCcw,
  AlertTriangle,
  FilePen,
  Plane,
} from 'lucide-react';
import type { Worker, ActivityEvent } from '../types';
import { getFarmById, getComplianceScore, getCountryFlag } from '../data/mockData';

interface WorkerDrawerProps {
  worker: Worker | null;
  onClose: () => void;
}

function ComplianceSparkline({ history }: { history: number[] }) {
  const width = 260;
  const height = 56;
  const padding = 4;
  const max = 100;
  const min = Math.min(...history, 50);
  const range = max - min || 1;

  const points = history.map((v, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const areaPath = `${path} L ${points[points.length - 1][0]} ${height - padding} L ${points[0][0]} ${height - padding} Z`;

  const latest = history[history.length - 1];
  const prior = history[history.length - 2] ?? latest;
  const delta = latest - prior;

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#sparkFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#16a34a"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
        {points.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={i === points.length - 1 ? 3.5 : 2}
            fill={i === points.length - 1 ? '#16a34a' : '#86efac'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + i * 0.04, type: 'spring', stiffness: 400, damping: 20 }}
          />
        ))}
      </svg>
      <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] font-semibold">
        <span className={delta >= 0 ? 'text-leaf-600 dark:text-leaf-400' : 'text-danger-600 dark:text-danger-400'}>
          {delta >= 0 ? '+' : ''}
          {delta} pts
        </span>
      </div>
    </div>
  );
}

function DocumentTimeline({ worker }: { worker: Worker }) {
  const icons = {
    Complete: FileCheck2,
    Pending: FileClock,
    Missing: FileQuestion,
    Expired: FileX2,
  } as const;
  const colors = {
    Complete: 'text-leaf-600 dark:text-leaf-400 bg-leaf-50 dark:bg-leaf-950/40 border-leaf-200 dark:border-leaf-900/60',
    Pending: 'text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-950/40 border-warning-200 dark:border-warning-900/60',
    Missing: 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 border-danger-200 dark:border-danger-900/60',
    Expired: 'text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-950/40 border-danger-200 dark:border-danger-900/60',
  };

  return (
    <div className="relative pl-6">
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        style={{ originY: 0 }}
        className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-leaf-300 via-gray-200 dark:via-gray-700 to-transparent"
      />
      <ul className="space-y-3.5">
        {worker.documents.map((doc, i) => {
          const Icon = icons[doc.status];
          return (
            <motion.li
              key={doc.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              className="relative"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.07, type: 'spring', stiffness: 400, damping: 20 }}
                className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center ${colors[doc.status]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
              </motion.span>
              <div className={`flex items-start justify-between p-2.5 rounded-lg border ${colors[doc.status]}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold">{doc.name}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {doc.uploadedDate && <span>Uploaded {new Date(doc.uploadedDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                      {doc.expiryDate && (
                        <span>{doc.uploadedDate ? ' \u00b7 ' : ''}Expires {new Date(doc.expiryDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      )}
                      {!doc.uploadedDate && !doc.expiryDate && <span>{doc.status}</span>}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ml-2">
                  {doc.status}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function ActivityItem({ event, i }: { event: ActivityEvent; i: number }) {
  const icons = {
    document: FileCheck2,
    contract: FilePen,
    visa: Plane,
    assignment: Building2,
    compliance: TrendingUp,
  } as const;
  const Icon = icons[event.type];

  return (
    <motion.li
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + i * 0.05 }}
      className="flex items-start gap-2.5 text-[11px]"
    >
      <div className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-gray-700 dark:text-gray-300 leading-snug">{event.label}</div>
        <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
          {new Date(event.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>
    </motion.li>
  );
}

const sectionVariants = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.1 } }),
};

export function WorkerDrawer({ worker, onClose }: WorkerDrawerProps) {
  useEffect(() => {
    if (!worker) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [worker, onClose]);

  return (
    <AnimatePresence>
      {worker && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.aside
            key="drawer"
            layoutId={`worker-${worker.id}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[440px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <motion.div
              custom={0}
              initial="hidden"
              animate="show"
              variants={sectionVariants}
              className="sticky top-0 z-10 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-leaf-300 to-leaf-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {worker.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {worker.name}
                    </h2>
                    <span className="text-sm">{getCountryFlag(worker.countryCode)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{worker.homeRegion}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                aria-label="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>

            <div className="p-5 space-y-6">
              {/* Hero metadata */}
              <motion.div custom={1} initial="hidden" animate="show" variants={sectionVariants}>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {getComplianceScore(worker)}%
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">
                      Compliance
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {worker.yearsInAgriculture}y
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">
                      Experience
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {worker.visaType}
                    </div>
                    <div className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-0.5">
                      Visa
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {getFarmById(worker.farmId)?.name ?? 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    Arrived {new Date(worker.arrivalDate).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Languages className="w-3 h-3" />
                    {worker.languages.join(', ')}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {worker.cropExperience.map((c) => (
                    <span key={c} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-leaf-100 dark:bg-leaf-950/60 text-leaf-700 dark:text-leaf-400">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Document timeline */}
              <motion.section custom={2} initial="hidden" animate="show" variants={sectionVariants}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Document Timeline
                </h3>
                <DocumentTimeline worker={worker} />
              </motion.section>

              {/* Compliance history */}
              <motion.section custom={3} initial="hidden" animate="show" variants={sectionVariants}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Compliance History (6mo)
                </h3>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                  <ComplianceSparkline history={worker.complianceHistory} />
                  <div className="flex justify-between mt-1.5 text-[9px] text-gray-400 dark:text-gray-500">
                    {['6mo', '5mo', '4mo', '3mo', '2mo', 'Now'].map((l) => (
                      <span key={l}>{l}</span>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Activity log */}
              <motion.section custom={4} initial="hidden" animate="show" variants={sectionVariants}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Activity Log
                </h3>
                <ul className="space-y-2.5">
                  {worker.activityLog.slice(0, 5).map((e, i) => (
                    <ActivityItem key={`${e.date}-${i}`} event={e} i={i} />
                  ))}
                </ul>
              </motion.section>

              {/* Past assignments */}
              <motion.section custom={5} initial="hidden" animate="show" variants={sectionVariants}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" />
                  Past Assignments
                </h3>
                {worker.pastAssignments.length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">No prior seasons on record.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {worker.pastAssignments.map((a, i) => (
                      <motion.li
                        key={`${a.farmId}-${a.year}`}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-900 dark:text-white truncate">
                            {a.farmName}
                          </div>
                          <div className="text-[10px] text-gray-500 dark:text-gray-400">{a.role}</div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-earth-100 dark:bg-earth-950/40 text-earth-700 dark:text-earth-400 flex-shrink-0 ml-2">
                          {a.year}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.section>

              {/* Actions */}
              <motion.section custom={6} initial="hidden" animate="show" variants={sectionVariants}>
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                  Actions
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Renew TRV', icon: RefreshCcw, color: 'leaf' },
                    { label: 'Update contract', icon: FilePen, color: 'neutral' },
                    { label: 'Escalate compliance issue', icon: AlertTriangle, color: 'danger' },
                  ].map((a) => {
                    const base = 'flex items-center justify-between w-full p-2.5 rounded-lg text-xs font-semibold transition-colors border';
                    const styles =
                      a.color === 'leaf'
                        ? 'bg-leaf-50 dark:bg-leaf-950/40 border-leaf-200 dark:border-leaf-900/60 text-leaf-700 dark:text-leaf-400 hover:bg-leaf-100 dark:hover:bg-leaf-950/60'
                        : a.color === 'danger'
                        ? 'bg-danger-50 dark:bg-danger-950/40 border-danger-200 dark:border-danger-900/60 text-danger-700 dark:text-danger-400 hover:bg-danger-100 dark:hover:bg-danger-950/60'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
                    return (
                      <motion.button
                        key={a.label}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`${base} ${styles}`}
                      >
                        <span className="flex items-center gap-2">
                          <a.icon className="w-3.5 h-3.5" />
                          {a.label}
                        </span>
                        <span className="text-[10px] opacity-60">Mock</span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
