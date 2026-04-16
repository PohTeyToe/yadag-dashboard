import { motion } from 'framer-motion';
import { Users, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { workers, farms, getExpiringDocuments, getFarmComplianceScore } from '../data/mockData';
import { useCountUp } from '../hooks/useCountUp';

function AnimatedStatValue({ value, suffix = '' }: { value: number; suffix?: string }) {
  const display = useCountUp(value, 1100, 120);
  return (
    <span className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

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
      suffix: '',
      sub: `${activeWorkers} active`,
      icon: Users,
      color: 'text-leaf-600 dark:text-leaf-400',
      bg: 'bg-leaf-50 dark:bg-leaf-950/40',
    },
    {
      label: 'Active Farms',
      value: totalFarms,
      suffix: '',
      sub: '2 provinces',
      icon: Building2,
      color: 'text-earth-600 dark:text-earth-400',
      bg: 'bg-earth-50 dark:bg-earth-950/40',
    },
    {
      label: 'Avg. Compliance',
      value: avgCompliance,
      suffix: '%',
      sub: 'across all farms',
      icon: ShieldCheck,
      color: avgCompliance >= 80 ? 'text-leaf-600 dark:text-leaf-400' : 'text-warning-600 dark:text-warning-400',
      bg: avgCompliance >= 80 ? 'bg-leaf-50 dark:bg-leaf-950/40' : 'bg-warning-50 dark:bg-warning-950/40',
    },
    {
      label: 'Urgent Alerts',
      value: urgentAlerts,
      suffix: '',
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2, boxShadow: '0 10px 30px -12px rgba(0,0,0,0.15)' }}
          transition={{ delay: 0.08 + i * 0.07, type: 'spring', stiffness: 260, damping: 28 }}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 sm:p-5 cursor-default"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
            </div>
            {stat.label === 'Urgent Alerts' && urgentAlerts > 0 && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-danger-500"
              />
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            <AnimatedStatValue value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.sub}</div>
        </motion.div>
      ))}
    </div>
  );
}
