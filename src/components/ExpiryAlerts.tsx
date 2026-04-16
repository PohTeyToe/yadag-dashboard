import { motion } from 'framer-motion';
import { AlertTriangle, Clock, FileWarning, ChevronRight } from 'lucide-react';
import { getExpiringDocuments, getCountryFlag } from '../data/mockData';

export function ExpiryAlerts() {
  const expiringDocs = getExpiringDocuments();

  const getUrgencyBadge = (days: number) => {
    if (days <= 0)
      return {
        label: 'Expired',
        className: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
        dotColor: 'bg-danger-500',
      };
    if (days <= 30)
      return {
        label: `${days}d left`,
        className: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400',
        dotColor: 'bg-danger-500',
      };
    if (days <= 60)
      return {
        label: `${days}d left`,
        className: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400',
        dotColor: 'bg-warning-500',
      };
    return {
      label: `${days}d left`,
      className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      dotColor: 'bg-yellow-500',
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-danger-50 dark:bg-danger-950/40">
            <AlertTriangle className="w-4 h-4 text-danger-600 dark:text-danger-400" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              Expiry Alerts
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Documents expiring within 90 days
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 text-xs font-semibold">
          {expiringDocs.length}
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-[400px] overflow-y-auto">
        {expiringDocs.map((item, i) => {
          const urgency = getUrgencyBadge(item.daysUntilExpiry);
          return (
            <motion.div
              key={`${item.worker.id}-${item.document.name}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.04 }}
              className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${urgency.dotColor}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.worker.name}
                    </span>
                    <span className="text-xs flex-shrink-0">
                      {getCountryFlag(item.worker.countryCode)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FileWarning className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.document.name}
                    </span>
                    {item.document.expiryDate && (
                      <>
                        <Clock className="w-3 h-3 text-gray-400 dark:text-gray-500 flex-shrink-0 ml-1" />
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {new Date(item.document.expiryDate).toLocaleDateString('en-CA', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${urgency.className}`}>
                  {urgency.label}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          );
        })}

        {expiringDocs.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No expiring documents found.
          </div>
        )}
      </div>
    </motion.div>
  );
}
