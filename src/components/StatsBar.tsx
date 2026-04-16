import { motion } from 'framer-motion';
import { Users, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { workers, farms, getExpiringDocuments, getFarmComplianceScore } from '../data/mockData';

export function StatsBar() {
  const totalWorkers = workers.length;
  const activeWorkers = workers.filter((w) => w.status === 'Active').length;
  const totalFarms = farms.length;
  const avgCompliance = Math.round(
    farms.reduce((sum, f) => sum + getFarmComplianceScore(f.id), 0) / farms.length
  );
  const urgentAlerts = getExpiringDocuments().filter((e) => e.daysUntilExpiry <= 30).length;

  const stats = [
    {
      label: 'Total Workers',
      value: totalWorkers,
      sub: `${activeWorkers} active`,
      icon: Users,
      color: 'text-leaf-600 dark:text-leaf-400',
      bg: 'bg-leaf-50 dark:bg-leaf-950/40',
    },
    {
      label: 'Active Farms',
      value: totalFarms,
      sub: '2 provinces',
      icon: Building2,
      color: 'text-earth-600 dark:text-earth-400',
      bg: 'bg-earth-50 dark:bg-earth-950/40',
    },
    {
      label: 'Avg. Compliance',
      value: `${avgCompliance}%`,
      sub: 'across all farms',
      icon: ShieldCheck,
      color: avgCompliance >= 80 ? 'text-leaf-600 dark:text-leaf-400' : 'text-warning-600 dark:text-warning-400',
      bg: avgCompliance >= 80 ? 'bg-leaf-50 dark:bg-leaf-950/40' : 'bg-warning-50 dark:bg-warning-950/40',
    },
    {
      label: 'Urgent Alerts',
      value: urgentAlerts,
      sub: 'within 30 days',
      icon: AlertTriangle,
      color: urgentAlerts > 0 ? 'text-danger-600 dark:text-danger-400' : 'text-leaf-600 dark:text-leaf-400',
      bg: urgentAlerts > 0 ? 'bg-danger-50 dark:bg-danger-950/40' : 'bg-leaf-50 dark:bg-leaf-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
            {stat.label}
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {stat.sub}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
