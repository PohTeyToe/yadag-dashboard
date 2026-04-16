import { motion } from 'framer-motion';
import { MapPin, Users, TrendingUp, Wheat } from 'lucide-react';
import { farms, getWorkersForFarm, getFarmComplianceScore, getComplianceScore } from '../data/mockData';

export function FarmCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {farms.map((farm, i) => {
        const farmWorkers = getWorkersForFarm(farm.id);
        const compliance = getFarmComplianceScore(farm.id);
        const activeCount = farmWorkers.filter((w) => w.status === 'Active').length;
        const pendingCount = farmWorkers.filter((w) => w.status === 'Pending').length;
        const expiringCount = farmWorkers.filter((w) => w.status === 'Expiring').length;

        // Calculate per-status compliance breakdown
        const fullyCompliant = farmWorkers.filter((w) => getComplianceScore(w) === 100).length;
        const partial = farmWorkers.filter((w) => {
          const s = getComplianceScore(w);
          return s > 0 && s < 100;
        }).length;
        const critical = farmWorkers.filter((w) => getComplianceScore(w) === 0).length;

        const complianceColor =
          compliance >= 90
            ? 'text-leaf-600 dark:text-leaf-400'
            : compliance >= 70
            ? 'text-warning-600 dark:text-warning-400'
            : 'text-danger-600 dark:text-danger-400';

        const complianceBarColor =
          compliance >= 90
            ? 'bg-leaf-500'
            : compliance >= 70
            ? 'bg-warning-500'
            : 'bg-danger-500';

        return (
          <motion.div
            key={farm.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08 }}
            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-gray-900/50 transition-shadow group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                  {farm.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="w-3 h-3" />
                  {farm.location}
                </div>
              </div>
              <div className="p-1.5 rounded-lg bg-leaf-50 dark:bg-leaf-950/40">
                <Wheat className="w-4 h-4 text-leaf-600 dark:text-leaf-400" />
              </div>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              {farm.cropType}
            </div>

            {/* Worker count */}
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {farmWorkers.length}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                / {farm.workerCapacity} capacity
              </span>
            </div>

            {/* Status pills */}
            <div className="flex gap-1.5 mb-4">
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-leaf-100 dark:bg-leaf-900/30 text-leaf-700 dark:text-leaf-400">
                  {activeCount} Active
                </span>
              )}
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400">
                  {pendingCount} Pending
                </span>
              )}
              {expiringCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400">
                  {expiringCount} Expiring
                </span>
              )}
            </div>

            {/* Compliance bar */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Compliance
                  </span>
                </div>
                <span className={`text-sm font-bold ${complianceColor}`}>{compliance}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${compliance}%` }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${complianceBarColor}`}
                />
              </div>
              <div className="flex gap-3 mt-2 text-[10px] text-gray-400 dark:text-gray-500">
                <span>{fullyCompliant} compliant</span>
                <span>{partial} partial</span>
                {critical > 0 && <span className="text-danger-500">{critical} critical</span>}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
