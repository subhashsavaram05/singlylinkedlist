import React from 'react';
import {
  Plus,
  Link as LinkIcon,
  Trash2,
  RotateCcw,
  Undo2,
  Redo2,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  Zap,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { AssistanceMode, SLLNode, SLLPointerState, SLLTaskDef } from '../../types/sllGame';
import { getContextualPlayAdvice } from '../../utils/sllStepAssistant';

interface SLLBottomControlsProps {
  onOpenCreateNode: () => void;
  onOpenChangeNext: () => void;
  onOpenSetHead: () => void;
  onOpenSetTail: () => void;
  onOpenDeleteNode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onResetTask: () => void;
  onOpenHint?: () => void;
  onOpenHowToPlay?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  nodeCount: number;
  isSettingHeadMode?: boolean;
  isSettingTailMode?: boolean;
  pendingConnectFrom?: number | null;
  onToggleSetHeadMode?: () => void;
  onToggleSetTailMode?: () => void;
  onCancelDirectMode?: () => void;
  assistanceMode?: AssistanceMode;
  isGuidedSolveActive?: boolean;
  isTaskComplete?: boolean;
  currentStep?: number;
  task?: SLLTaskDef;
  nodes?: SLLNode[];
  pointers?: SLLPointerState;
  onExecuteTeacherStep?: () => void;
}

export const SLLBottomControls: React.FC<SLLBottomControlsProps> = ({
  onOpenCreateNode,
  onOpenChangeNext,
  onOpenSetHead,
  onOpenSetTail,
  onOpenDeleteNode,
  onUndo,
  onRedo,
  onResetTask,
  onOpenHint,
  onOpenHowToPlay,
  canUndo,
  canRedo,
  nodeCount,
  isSettingHeadMode,
  isSettingTailMode,
  pendingConnectFrom,
  onToggleSetHeadMode,
  onToggleSetTailMode,
  onCancelDirectMode,
  assistanceMode = 'play',
  isGuidedSolveActive = false,
  isTaskComplete = false,
  currentStep = 1,
  task,
  nodes = [],
  pointers = { headAddress: null, tailAddress: null, currentAddress: null, tempAddress: null, prevAddress: null },
  onExecuteTeacherStep,
}) => {
  const isAnyDirectMode = isSettingHeadMode || isSettingTailMode || pendingConnectFrom !== null;

  // Contextual advice for PLAY mode
  const playAdvice = task ? getContextualPlayAdvice(task, nodes, pointers, currentStep) : null;

  return (
    <div className="w-full flex flex-col gap-2 font-sans">
      {/* Active Direct Click / Drag Action Prompt */}
      {isAnyDirectMode && (
        <div className="w-full p-2.5 rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/30 flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-medium text-blue-900 dark:text-blue-200">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-ping shrink-0" />
            <span>
              {isSettingHeadMode && '👉 Click any node in the workspace above to point HEAD to it.'}
              {isSettingTailMode && '👉 Click any node in the workspace above to point TAIL to it.'}
              {pendingConnectFrom !== null && `👉 Click destination node (or drop on NULL) to connect Node ${pendingConnectFrom}'s NEXT.`}
            </span>
          </div>
          {onCancelDirectMode && (
            <button
              type="button"
              onClick={onCancelDirectMode}
              className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Main Controls Card */}
      <div className="w-full bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 rounded-3xl p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-2.5 font-sans">
        {/* Left Side: Contextual Controls in PLAY mode OR NEXT STEP in Guided solve flow */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {isGuidedSolveActive ? (
            /* GUIDED SOLVE FLOW: NEXT STEP (executes next step with 0 points deducted) */
            <button
              id="guide-solve-bottom-btn"
              onClick={onExecuteTeacherStep}
              disabled={isTaskComplete}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FFF3E0] dark:bg-[#2A1D0D] border-2 border-[#FDBA5A] text-[#7C3F00] dark:text-[#FDBA5A] text-xs font-bold shadow-xs transition-all ${
                isTaskComplete
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-[#FFE7C4] dark:hover:bg-[#382611] cursor-pointer hover:scale-105 active:scale-95'
              }`}
            >
              <Zap className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
              <span>{isTaskComplete ? 'ALL STEPS COMPLETED' : 'NEXT STEP'}</span>
            </button>
          ) : (
            /* Workspace clear status indication */
            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700 dark:text-slate-200">Interactive Workspace</span>
              <span className="text-slate-400 hidden sm:inline">• Pointer Tools active above</span>
            </div>
          )}
        </div>

        {/* Right Side: Undo, Redo, How to Play */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {onOpenHowToPlay && (
            <button
              onClick={onOpenHowToPlay}
              className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#EFF6FF] dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/30 text-[#2563EB] dark:text-blue-300 text-xs font-bold hover:bg-[#DBEAFE] transition-colors cursor-pointer"
              title="How to Play"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">How to Play</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
