import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  Clock,
  Leaf,
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  Check,
  X,
} from 'lucide-react';
import { getUnassignedWorkers, getMatchRecommendations, getCountryFlag, getFarmById } from '../data/mockData';
import type { Worker, MatchRecommendation } from '../types';

function AnimatedNumber({ target, delay = 0 }: { target: number; delay?: number }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let frameId: number;
    const duration = 900;
    const tick = (t: number) => {
      const elapsed = t - start - delay;
      if (elapsed < 0) {
        frameId = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [target, delay]);
  return <>{value}</>;
}

function ScoreRing({ score, size = 64, isTop = false }: { score: number; size?: number; isTop?: boolean }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = score >= 90 ? '#16a34a' : score >= 75 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {isTop && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 20px 2px ${color}55` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}
      <svg width={size} height={size} className="relative -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          className="text-gray-200 dark:text-gray-800"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold" style={{ color }}>
          <AnimatedNumber target={score} delay={200} />
        </span>
        <span className="text-[8px] uppercase tracking-widest text-gray-400 dark:text-gray-500 leading-none">
          match
        </span>
      </div>
    </div>
  );
}

function SubScoreBar({ label, value, icon: Icon, delay }: { label: string; value: number; icon: React.ComponentType<{ className?: string }>; delay: number }) {
  const color = value >= 90 ? 'bg-leaf-500' : value >= 75 ? 'bg-leaf-400' : value >= 60 ? 'bg-warning-500' : 'bg-danger-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </div>
        <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
          <AnimatedNumber target={value} delay={delay * 1000} />
        </span>
      </div>
      <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

function MatchCard({
  worker,
  match,
  rank,
  onPropose,
  proposed,
}: {
  worker: Worker;
  match: MatchRecommendation;
  rank: number;
  onPropose: () => void;
  proposed: boolean;
}) {
  const farm = getFarmById(match.farmId);
  const isTop = rank === 0;
  const [showRationale, setShowRationale] = useState(isTop);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + rank * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative rounded-xl border p-3.5 ${
        isTop
          ? 'bg-gradient-to-br from-leaf-50 to-white dark:from-leaf-950/40 dark:to-gray-900 border-leaf-200 dark:border-leaf-900/60'
          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
      }`}
    >
      {isTop && (
        <div className="absolute -top-2 left-3 px-1.5 py-0.5 rounded-full bg-leaf-600 text-white text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Top pick
        </div>
      )}
      <div className="flex items-start gap-3">
        <ScoreRing score={match.score} isTop={isTop} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {match.farmName}
              </h4>
              <div className="flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{farm?.location}</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-400">
            {farm?.cropType} &middot; {farm?.plantingWindow}
          </div>
        </div>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-x-3 gap-y-2">
        <SubScoreBar label="Skills" value={match.breakdown.skills} icon={Leaf} delay={0.3 + rank * 0.08} />
        <SubScoreBar label="Location" value={match.breakdown.location} icon={MapPin} delay={0.35 + rank * 0.08} />
        <SubScoreBar label="Visa" value={match.breakdown.visa} icon={BadgeCheck} delay={0.4 + rank * 0.08} />
        <SubScoreBar label="Availability" value={match.breakdown.availability} icon={Clock} delay={0.45 + rank * 0.08} />
        <div className="col-span-2">
          <SubScoreBar label="Experience" value={match.breakdown.experience} icon={ShieldCheck} delay={0.5 + rank * 0.08} />
        </div>
      </div>

      <button
        onClick={() => setShowRationale(!showRationale)}
        className="mt-3 flex items-center justify-between w-full text-[11px] font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <span className="uppercase tracking-wider">Why this match</span>
        {showRationale ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>
      <AnimatePresence initial={false}>
        {showRationale && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="mt-2 space-y-1.5 overflow-hidden"
          >
            {match.rationale.map((r, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-2 text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                <span className="text-leaf-500 mt-1.5 inline-block w-1 h-1 rounded-full bg-current flex-shrink-0" />
                <span>{r}</span>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        disabled={proposed}
        onClick={onPropose}
        className={`mt-3 w-full py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
          proposed
            ? 'bg-leaf-600 text-white cursor-default'
            : isTop
            ? 'bg-leaf-600 hover:bg-leaf-700 text-white'
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        {proposed ? (
          <>
            <Check className="w-3.5 h-3.5" />
            Proposed to {worker.name.split(' ')[0]}
          </>
        ) : (
          'Propose match'
        )}
      </motion.button>
    </motion.div>
  );
}

function WorkerColumn({
  worker,
  columnIndex,
  proposals,
  onPropose,
}: {
  worker: Worker;
  columnIndex: number;
  proposals: Record<string, string | null>;
  onPropose: (workerId: string, farmId: string) => void;
}) {
  const matches = useMemo(() => getMatchRecommendations(worker, 3), [worker]);
  const proposedFarm = proposals[worker.id];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + columnIndex * 0.1, duration: 0.5 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-center gap-3 px-1">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-leaf-300 to-leaf-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {worker.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {worker.name}
            </span>
            <span className="text-sm">{getCountryFlag(worker.countryCode)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
            <span>{worker.yearsInAgriculture}y experience</span>
            <span className="text-gray-300 dark:text-gray-700">&middot;</span>
            <span>{worker.visaType}</span>
            <span className="text-gray-300 dark:text-gray-700">&middot;</span>
            <span className="truncate">{worker.homeRegion.split(',')[0]}</span>
          </div>
        </div>
      </div>

      {matches.map((m, i) => (
        <MatchCard
          key={m.farmId}
          worker={worker}
          match={m}
          rank={i}
          proposed={proposedFarm === m.farmId}
          onPropose={() => onPropose(worker.id, m.farmId)}
        />
      ))}
    </motion.div>
  );
}

export function MatchPanel() {
  const unassigned = useMemo(() => getUnassignedWorkers(), []);
  const [expanded, setExpanded] = useState(true);
  const [proposals, setProposals] = useState<Record<string, string | null>>({});
  const [toast, setToast] = useState<string | null>(null);

  const handlePropose = (workerId: string, farmId: string) => {
    setProposals((p) => ({ ...p, [workerId]: farmId }));
    const worker = unassigned.find((w) => w.id === workerId);
    const farm = getFarmById(farmId);
    if (worker && farm) {
      setToast(`Proposed ${worker.name} to ${farm.name}`);
      setTimeout(() => setToast(null), 2800);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 rounded-lg bg-gradient-to-br from-leaf-500 to-leaf-700 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-leaf-400"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-left">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              AI Match Recommendations
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-leaf-100 dark:bg-leaf-950/60 text-leaf-700 dark:text-leaf-400">
                Beta
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {unassigned.length} unassigned workers. Top farm picks based on skills, visa, location, availability.
            </p>
          </div>
        </div>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {unassigned.map((w, i) => (
                <WorkerColumn
                  key={w.id}
                  worker={w}
                  columnIndex={i}
                  proposals={proposals}
                  onPropose={handlePropose}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 bg-leaf-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm font-medium"
          >
            <Check className="w-4 h-4" />
            {toast}
            <button onClick={() => setToast(null)} className="opacity-60 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
