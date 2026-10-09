import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  BookOpen,
  Gamepad2,
  Eye,
  HelpCircle,
  Award,
  Check,
  Star,
  Circle,
} from 'lucide-react';
import { progressManager, CentralizedProgressState, LEARN_ACTIVITIES } from '../utils/progressManager';
import { ModuleRecord, ModuleStatus, MainViewTab } from '../types/game';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { ResetProgressModal } from './ResetProgressModal';
import { soundManager } from '../utils/audio';

interface MyProgressViewProps {
  onNavigateToTab: (tab: MainViewTab, levelId?: number, chapterId?: string) => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({ onNavigateToTab }) => {
  useScrollReveal();
  const [centralState, setCentralState] = useState<CentralizedProgressState>(() =>
    progressManager.getCentralState()
  );
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FOUNDATION' | 'TECHNIQUE' | 'ANALYSIS'>('ALL');

  useEffect(() => {
    const unsubscribe = progressManager.subscribe((state) => {
      setCentralState(state);
    });
    return unsubscribe;
  }, []);

  const totalPoints = centralState.totalPoints;
  const learnScore = centralState.learnScore;
  const visualizeScore = centralState.visualizeScore;
  const gameScore = centralState.gameScore;
  const quizScore = centralState.quizScore;
  const percentage = Math.round((totalPoints / 100) * 100);
  const is100Percent = totalPoints === 100;
  const mastery = progressManager.getMasteryLevel(totalPoints);
  const completedActivities = progressManager.getCompletedActivitiesCount();
  const totalActivities = progressManager.getTotalActivitiesCount();

  const handleReset = () => {
    soundManager.playReset();
    progressManager.resetProgress();
    setShowResetConfirm(false);
  };

  const categoryCards = [
    {
      id: 'learn',
      title: 'Learn',
      score: learnScore,
      max: 25,
      icon: BookOpen,
      tab: 'THEORY' as MainViewTab,
      color: 'blue',
      barColor: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'visualize',
      title: 'Visualize',
      score: visualizeScore,
      max: 15,
      icon: Eye,
      tab: 'VIDEO' as MainViewTab,
      color: 'cyan',
      barColor: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'game',
      title: 'Game',
      score: gameScore,
      max: 40,
      icon: Gamepad2,
      tab: 'GAME' as MainViewTab,
      color: 'emerald',
      barColor: 'from-emerald-500 to-teal-600',
    },
    {
      id: 'quiz',
      title: 'Quiz',
      score: quizScore,
      max: 20,
      icon: HelpCircle,
      tab: 'QUIZ' as MainViewTab,
      color: 'amber',
      barColor: 'from-amber-500 to-orange-500',
    },
  ];

  const modules = progressManager.getModules();
  const filteredModules =
    activeFilter === 'ALL' ? modules : modules.filter((m) => m.category === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 font-sans text-slate-900 dark:text-white animate-page-enter pb-24">
      {/* Header Section */}
      <div className="border-b border-slate-200 dark:border-blue-900/30 pb-6 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-900/30">
              Curriculum Progress Tracker
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
              Live Real-Time Sync
            </span>
          </div>

          <button
            id="btn-reset-progress-dialog"
            onClick={() => {
              soundManager.playModalOpen();
              setShowResetConfirm(true);
            }}
            className="text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
          Learning Progress & Mastery
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Track your progress through Singly Linked List concepts, visualizations, pointer manipulation games, and quizzes.
        </p>

        {/* 100% Completion Golden Banner if Completed */}
        {is100Percent && (
          <div
            id="progress-100-percent-banner"
            className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-slate-900 border border-amber-300 dark:border-amber-500/30 rounded-2xl shadow-xs dark:shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-editorial-scale"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-xs font-bold font-mono text-amber-700 dark:text-amber-300 uppercase tracking-wider">
                  ★ CONGRATULATIONS! 100% CURRICULUM COMPLETED
                </div>
                <div className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  🎉 MASTER (100 / 100 Points)
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('POINTS')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/25 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>View Points Breakdown</span>
            </button>
          </div>
        )}
      </div>

      {/* 1. OVERALL COMPLETION HERO CARD */}
      <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 rounded-3xl p-6 sm:p-7 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-8 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono block mb-1">
              OVERALL COMPLETION
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white font-mono leading-none">
                {totalPoints} / 100 Points
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#2563EB] dark:text-blue-400 font-mono">
                {percentage}%
              </span>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Completed Activities
            </span>
            <span className="text-xl sm:text-2xl font-extrabold font-mono text-slate-800 dark:text-slate-200">
              {completedActivities} / {totalActivities}
            </span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              Level: {mastery.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200 dark:border-blue-900/30 mb-2">
          <div
            className="bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#6366F1] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 dark:text-slate-500">
          <span>0–24 Beginner</span>
          <span>25–49 Learner</span>
          <span>50–74 Intermediate</span>
          <span>75–99 Advanced</span>
          <span>100 Master</span>
        </div>
      </div>

      {/* 2. CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {categoryCards.map((cat) => {
          const Icon = cat.icon;
          const catPercent = Math.round((cat.score / cat.max) * 100);

          return (
            <div
              key={cat.id}
              onClick={() => {
                soundManager.playNav();
                onNavigateToTab(cat.tab);
              }}
              className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 rounded-2xl p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-blue-300 dark:hover:border-blue-700/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-300 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {catPercent}%
                  </span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono">
                  {cat.title}
                </div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {cat.score} <span className="text-sm text-slate-400 font-normal">/ {cat.max}</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`bg-gradient-to-r ${cat.barColor} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${catPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] font-mono text-[#2563EB] dark:text-blue-400 font-semibold">
                  <span>Open {cat.title}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOTAL BAR SUMMARY */}
      <div className="bg-slate-50 dark:bg-[#070B18] border border-slate-200 dark:border-blue-900/30 rounded-2xl p-4 mb-8 flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
            ∑
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              TOTAL ACCUMULATED SCORE
            </span>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Learn: {learnScore}/25 • Visualize: {visualizeScore}/15 • Game: {gameScore}/40 • Quiz: {quizScore}/20
            </div>
          </div>
        </div>

        <div className="flex items-baseline gap-1 text-right">
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {totalPoints}
          </span>
          <span className="text-sm text-slate-400 font-bold">/ 100</span>
        </div>
      </div>

      {/* 3. CURRICULUM MODULES LIST */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-blue-900/30 pb-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {(['ALL', 'FOUNDATION', 'TECHNIQUE', 'ANALYSIS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playTab();
                  setActiveFilter(cat);
                }}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#080D1F] text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Sections' : cat.charAt(0) + cat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            Showing {filteredModules.length} of {modules.length} Sections
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {LEARN_ACTIVITIES.map((item, idx) => {
            const isDone = progressManager.isCompleted(item.id);

            return (
              <div
                key={item.id}
                onClick={() => {
                  soundManager.playSelect();
                  onNavigateToTab('THEORY', undefined, item.theoryChapterId);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isDone
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-300'
                    : 'bg-white dark:bg-[#0B1228] border-slate-200 dark:border-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    SLL-{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                      isDone
                        ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {isDone ? `✓ +${item.points} pts` : `${item.points} pts`}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    Complete learning activity in the Learn section to earn {item.points} point(s).
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-blue-900/20 text-xs font-semibold">
                  <span className={isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}>
                    {isDone ? 'Completed' : 'Not Completed'}
                  </span>
                  <div className="flex items-center gap-1 text-[#2563EB] dark:text-blue-400">
                    <span>Study</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Modal */}
      <ResetProgressModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
      />
    </div>
  );
};
