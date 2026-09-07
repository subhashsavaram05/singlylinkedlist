import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  ArrowRight,
  ArrowDown,
  Layers,
  Database,
  Cpu,
  Search,
  PlusCircle,
  Trash2,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface SLLVideoVisualizerProps {
  lessonId: 'lesson-01' | 'lesson-02';
  onComplete?: () => void;
}

// 8 Core Concepts for Video 1 (Introduction)
const VIDEO_1_CONCEPTS = [
  {
    id: 'sll-concept',
    number: '01',
    title: 'What is a Singly Linked List?',
    subtitle: 'Linear Dynamic Data Structure',
    description:
      'A Singly Linked List is a linear collection of data elements called Nodes. Unlike arrays, nodes are not stored in contiguous memory locations; instead, each node points to the next one in sequence.',
    highlightParts: ['all'],
  },
  {
    id: 'node-anatomy',
    number: '02',
    title: 'What is a Node?',
    subtitle: 'The Atomic Building Block',
    description:
      'A Node is a composite container composed of two distinct components: a Data field (Payload) and a Pointer field (Next).',
    highlightParts: ['node-0'],
  },
  {
    id: 'data-payload',
    number: '03',
    title: 'Data / Payload',
    subtitle: 'Storing the Core Value',
    description:
      'The data segment stores the actual informational payload (such as integer 10, 20, 30, or complex objects). It occupies fixed bytes in memory based on its data type.',
    highlightParts: ['data-0', 'data-1', 'data-2'],
  },
  {
    id: 'next-pointer',
    number: '04',
    title: 'Next Pointer',
    subtitle: 'Connecting Address Reference',
    description:
      'The Next pointer is a reference variable holding the 64-bit hexadecimal memory address of the subsequent node in heap memory (e.g., 0x2000).',
    highlightParts: ['pointer-0', 'pointer-1'],
  },
  {
    id: 'head-pointer',
    number: '05',
    title: 'Head Pointer',
    subtitle: 'Entry Point into the List',
    description:
      'The HEAD pointer is the external reference that stores the memory address of the first node. If HEAD is NULL, the list is empty.',
    highlightParts: ['head'],
  },
  {
    id: 'connecting-nodes',
    number: '06',
    title: 'Connecting Nodes',
    subtitle: 'Unidirectional Pointer Links',
    description:
      'Nodes are joined by assigning the Next pointer of Node A to the memory address of Node B (NodeA->next = NodeB). Traversal is strictly one-way (forward).',
    highlightParts: ['arrow-0', 'arrow-1'],
  },
  {
    id: 'last-node-null',
    number: '07',
    title: 'Last Node & NULL',
    subtitle: 'List Termination Sentinel',
    description:
      'The tail node is identified by having its Next pointer set to NULL (0x0000). This acts as the sentinel boundary condition during traversal.',
    highlightParts: ['null-term'],
  },
  {
    id: 'dynamic-memory',
    number: '08',
    title: 'Dynamic Memory Allocation',
    subtitle: 'Heap Allocation at Runtime',
    description:
      'Each node is independently created on the Heap at runtime via dynamic allocation (malloc() in C/C++ or new in Java/TypeScript). Memory grows and shrinks on demand without reallocation.',
    highlightParts: ['mem-chips'],
  },
];

// 9 Interactive Operations for Video 2 (Operations)
const VIDEO_2_OPERATIONS = [
  {
    id: 'traversal',
    number: '01',
    title: 'Sequential Traversal',
    badge: 'TRAVERSAL',
    subtitle: 'HEAD → 10 → 20 → 30 → NULL',
    description: 'Visiting each node sequentially from HEAD to NULL to process or display data.',
    complexity: 'O(N) Time | O(1) Space',
  },
  {
    id: 'insert-beginning',
    number: '02',
    title: 'Insertion at Beginning',
    badge: 'INSERT AT HEAD',
    subtitle: 'HEAD → [ 5 ] → 10 → 20 → 30',
    description: 'Allocating a new node, pointing its Next to current HEAD, then updating HEAD.',
    complexity: 'O(1) Time | O(1) Space',
  },
  {
    id: 'insert-end',
    number: '03',
    title: 'Insertion at End',
    badge: 'INSERT AT TAIL',
    subtitle: '10 → 20 → 30 → [ 40 ] → NULL',
    description: 'Traversing to the tail node and rewiring its Next pointer to the new node.',
    complexity: 'O(N) Time | O(1) Space',
  },
  {
    id: 'insert-position',
    number: '04',
    title: 'Insertion at Specific Position',
    badge: 'INSERT BETWEEN',
    subtitle: 'HEAD → 10 → [ 15 ] → 20 → 30 → NULL',
    description: 'Inserting node 15 between 10 and 20 by carefully rewiring pointers to avoid breaking the chain.',
    complexity: 'O(P) Time | O(1) Space',
  },
  {
    id: 'delete-first',
    number: '05',
    title: 'Deletion of First Node',
    badge: 'DELETE HEAD',
    subtitle: 'Remove 10 → New HEAD is 20',
    description: 'Moving HEAD to HEAD->next and deallocating the former first node from heap memory.',
    complexity: 'O(1) Time | O(1) Space',
  },
  {
    id: 'delete-last',
    number: '06',
    title: 'Deletion of Last Node',
    badge: 'DELETE TAIL',
    subtitle: 'Traverse to 20 → Set Next = NULL → Free 30',
    description: 'Traversing to second-to-last node, pointing its Next to NULL, and freeing tail.',
    complexity: 'O(N) Time | O(1) Space',
  },
  {
    id: 'delete-specific',
    number: '07',
    title: 'Deletion of Specific Node',
    badge: 'DELETE TARGET',
    subtitle: 'Before: 10 → 20 → 30 → NULL | After: 10 → 30 → NULL',
    description: 'Deleting node 20 by updating predecessor pointer (10->next = 30) and freeing node 20.',
    complexity: 'O(N) Time | O(1) Space',
  },
  {
    id: 'searching',
    number: '08',
    title: 'Linear Search',
    badge: 'SEARCH KEY',
    subtitle: 'Scan each node comparing Key == Target',
    description: 'Examining payload sequentially until target is found or list ends at NULL.',
    complexity: 'O(N) Time | O(1) Space',
  },
  {
    id: 'pointer-rewiring',
    number: '09',
    title: 'Pointer Rewiring Principles',
    badge: 'POINTER REWIRING',
    subtitle: 'prev->next = curr->next; free(curr);',
    description: 'Safely manipulating pointers using temporary references to prevent dangling pointers and memory leaks.',
    complexity: 'Safe Heap Manipulation',
  },
];

export const SLLVideoVisualizer: React.FC<SLLVideoVisualizerProps> = ({
  lessonId,
  onComplete,
}) => {
  const isLesson1 = lessonId === 'lesson-01';

  // State for Lesson 1 (Concepts)
  const [conceptIndex, setConceptIndex] = useState<number>(0);
  const [isConceptAutoPlaying, setIsConceptAutoPlaying] = useState<boolean>(false);

  // State for Lesson 2 (Operations)
  const [opIndex, setOpIndex] = useState<number>(0);
  const [opStep, setOpStep] = useState<number>(0);
  const [isOpPlaying, setIsOpPlaying] = useState<boolean>(false);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play timer for Lesson 1
  useEffect(() => {
    if (!isConceptAutoPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setConceptIndex((prev) => {
        if (prev >= VIDEO_1_CONCEPTS.length - 1) {
          setIsConceptAutoPlaying(false);
          soundManager.playSuccess();
          if (onComplete) onComplete();
          return prev;
        }
        soundManager.playClick();
        return prev + 1;
      });
    }, 3800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isConceptAutoPlaying, onComplete]);

  // Auto-play animation stepper for Lesson 2
  useEffect(() => {
    if (!isOpPlaying) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    autoPlayTimerRef.current = setInterval(() => {
      setOpStep((prev) => {
        if (prev >= 3) {
          setIsOpPlaying(false);
          soundManager.playSuccess();
          return 3;
        }
        soundManager.playClick();
        return prev + 1;
      });
    }, 1800);

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isOpPlaying]);

  const handleSelectConcept = (idx: number) => {
    soundManager.playClick();
    setConceptIndex(idx);
    setIsConceptAutoPlaying(false);
  };

  const handleSelectOperation = (idx: number) => {
    soundManager.playClick();
    setOpIndex(idx);
    setOpStep(0);
    setIsOpPlaying(false);
  };

  const currentConcept = VIDEO_1_CONCEPTS[conceptIndex];
  const currentOp = VIDEO_2_OPERATIONS[opIndex];

  return (
    <div className="w-full bg-[#050A1A] rounded-2xl border border-blue-900/50 shadow-[0_8px_32px_rgba(0,0,0,0.6),0_0_30px_rgba(37,99,235,0.15)] overflow-hidden text-white select-none">
      {/* Visualizer Top Bar */}
      <div className="px-4 sm:px-6 py-3.5 bg-gradient-to-r from-[#0B1533] via-[#091026] to-[#0B1533] border-b border-blue-800/40 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-wider bg-blue-600/90 text-white border border-blue-400/40 shadow-xs">
            {isLesson1 ? 'LESSON 01' : 'LESSON 02'}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-950/70 text-blue-300 border border-blue-700/40 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{isLesson1 ? '08:45' : '12:30'}</span>
          </span>
          <div className="hidden md:flex items-center gap-1.5 text-xs text-blue-300/80 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Educational Visualization</span>
          </div>
        </div>

        {/* AlgoLearn Logo at Top-Right */}
        <div className="flex items-center gap-2">
          <img
            src="/algolearn-logo-dark.png"
            alt="AlgoLearn"
            className="h-6 sm:h-7 w-auto object-contain select-none drop-shadow"
          />
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative p-4 sm:p-8 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between overflow-hidden bg-radial-grid">
        {/* Subtle Cyber Grid & Circuit Background Accent */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(37,99,235,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(37,99,235,0.06)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* =========================================================================
            LESSON 1 VISUALIZATION: 8 CORE FUNDAMENTALS & ANIMATED SLL STRUCTURE
            ========================================================================= */}
        {isLesson1 ? (
          <div className="relative z-10 space-y-6">
            {/* Centered Title Header */}
            <div className="text-center space-y-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-blue-400 uppercase">
                SINGLY LINKED LIST
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(59,130,246,0.5)]">
                INTRODUCTION & FUNDAMENTALS
              </h3>
            </div>

            {/* Visual Node Diagram: HEAD ↓ [ 10 | NEXT ] → [ 20 | NEXT ] → [ 30 | NEXT ] → NULL */}
            <div className="py-6 px-2 overflow-x-auto flex items-center justify-center min-w-max">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* HEAD Pointer */}
                <div
                  className={`flex flex-col items-center transition-all duration-300 ${
                    currentConcept.highlightParts.includes('head') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'scale-105 filter drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]'
                      : 'opacity-80'
                  }`}
                >
                  <span className="px-2.5 py-1 rounded-md text-xs font-mono font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 text-white border border-cyan-300 shadow-md">
                    HEAD
                  </span>
                  <ArrowDown className="w-5 h-5 text-cyan-400 mt-1 animate-bounce" />
                  <span className="text-[10px] font-mono text-cyan-300/80 mt-0.5">0x1000</span>
                </div>

                {/* Node 1: [ 10 | NEXT (0x2000) ] */}
                <div
                  className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentConcept.highlightParts.includes('node-0') ||
                    currentConcept.highlightParts.includes('data-0') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.6)] ring-2 ring-blue-500/40'
                      : 'border-blue-800/70 bg-[#08122E]'
                  }`}
                >
                  <div
                    className={`px-4 py-3 bg-[#0B1A40] flex flex-col items-center justify-center min-w-[64px] border-r border-blue-800/60 ${
                      currentConcept.highlightParts.includes('data-0')
                        ? 'bg-blue-600/30'
                        : ''
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-blue-300/70 uppercase">DATA</span>
                    <span className="text-lg sm:text-xl font-mono font-extrabold text-white">10</span>
                  </div>
                  <div
                    className={`px-3 py-3 bg-[#07112B] flex flex-col items-center justify-center min-w-[70px] ${
                      currentConcept.highlightParts.includes('pointer-0')
                        ? 'bg-cyan-600/30'
                        : ''
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-cyan-400/80 uppercase">NEXT</span>
                    <span className="text-[11px] font-mono font-bold text-cyan-300">0x2000</span>
                  </div>
                </div>

                {/* Arrow 1 */}
                <div
                  className={`flex items-center text-blue-400 transition-all ${
                    currentConcept.highlightParts.includes('arrow-0') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'text-cyan-300 scale-110'
                      : 'opacity-70'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>

                {/* Node 2: [ 20 | NEXT (0x3000) ] */}
                <div
                  className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentConcept.highlightParts.includes('data-1') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                      : 'border-blue-800/70 bg-[#08122E]'
                  }`}
                >
                  <div
                    className={`px-4 py-3 bg-[#0B1A40] flex flex-col items-center justify-center min-w-[64px] border-r border-blue-800/60 ${
                      currentConcept.highlightParts.includes('data-1')
                        ? 'bg-blue-600/30'
                        : ''
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-blue-300/70 uppercase">DATA</span>
                    <span className="text-lg sm:text-xl font-mono font-extrabold text-white">20</span>
                  </div>
                  <div
                    className={`px-3 py-3 bg-[#07112B] flex flex-col items-center justify-center min-w-[70px] ${
                      currentConcept.highlightParts.includes('pointer-1')
                        ? 'bg-cyan-600/30'
                        : ''
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-cyan-400/80 uppercase">NEXT</span>
                    <span className="text-[11px] font-mono font-bold text-cyan-300">0x3000</span>
                  </div>
                </div>

                {/* Arrow 2 */}
                <div
                  className={`flex items-center text-blue-400 transition-all ${
                    currentConcept.highlightParts.includes('arrow-1') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'text-cyan-300 scale-110'
                      : 'opacity-70'
                  }`}
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>

                {/* Node 3: [ 30 | NEXT (NULL) ] */}
                <div
                  className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    currentConcept.highlightParts.includes('data-2') ||
                    currentConcept.highlightParts.includes('all')
                      ? 'border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.6)]'
                      : 'border-blue-800/70 bg-[#08122E]'
                  }`}
                >
                  <div className="px-4 py-3 bg-[#0B1A40] flex flex-col items-center justify-center min-w-[64px] border-r border-blue-800/60">
                    <span className="text-[9px] font-mono font-bold text-blue-300/70 uppercase">DATA</span>
                    <span className="text-lg sm:text-xl font-mono font-extrabold text-white">30</span>
                  </div>
                  <div
                    className={`px-3 py-3 bg-[#07112B] flex flex-col items-center justify-center min-w-[70px] ${
                      currentConcept.highlightParts.includes('null-term')
                        ? 'bg-rose-950/50'
                        : ''
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-rose-400/80 uppercase">NEXT</span>
                    <span className="text-[11px] font-mono font-bold text-rose-300">NULL</span>
                  </div>
                </div>

                {/* Arrow 3 */}
                <div className="flex items-center text-rose-400 opacity-80">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                </div>

                {/* NULL Sentinel Terminal Box */}
                <div
                  className={`px-3 py-2.5 rounded-lg border-2 font-mono font-bold text-xs flex items-center justify-center transition-all ${
                    currentConcept.highlightParts.includes('null-term')
                      ? 'border-rose-400 bg-rose-950/60 text-rose-200 shadow-[0_0_16px_rgba(244,63,94,0.6)] scale-105'
                      : 'border-slate-700 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  NULL
                </div>
              </div>
            </div>

            {/* Active Concept Card / Breakdown */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#091433]/80 border border-blue-700/50 backdrop-blur-md shadow-lg space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-600 text-white">
                    CONCEPT {currentConcept.number} / 08
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                    {currentConcept.title}
                  </h4>
                </div>
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  {currentConcept.subtitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentConcept.description}
              </p>
            </div>
          </div>
        ) : (
          /* =========================================================================
             LESSON 2 VISUALIZATION: 9 INTERACTIVE OPERATIONS
             ========================================================================= */
          <div className="relative z-10 space-y-6">
            {/* Centered Title Header */}
            <div className="text-center space-y-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-blue-400 uppercase">
                SINGLY LINKED LIST
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(59,130,246,0.5)]">
                OPERATIONS & PRACTICAL ANIMATIONS
              </h3>
            </div>

            {/* Interactive Dynamic Linked List Canvas based on Selected Operation & Step */}
            <div className="py-6 px-2 overflow-x-auto flex items-center justify-center min-w-max">
              {/* OPERATION 1: TRAVERSAL HEAD → 10 → 20 → 30 → NULL */}
              {currentOp.id === 'traversal' && (
                <div className="flex items-center gap-3">
                  <div
                    className={`flex flex-col items-center transition-all ${
                      opStep === 0 ? 'scale-110 text-cyan-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.9)]' : 'opacity-70'
                    }`}
                  >
                    <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-mono text-xs font-bold">HEAD</span>
                    <ArrowDown className="w-4 h-4 mt-1 animate-pulse" />
                  </div>

                  {/* Node 10 */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      opStep === 1
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_24px_rgba(16,185,129,0.7)] scale-105'
                        : 'border-blue-800 bg-[#08122E]'
                    }`}
                  >
                    <div className="px-4 py-3 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-lg">10</div>
                    <div className="px-3 py-3 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400" />

                  {/* Node 20 */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      opStep === 2
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_24px_rgba(16,185,129,0.7)] scale-105'
                        : 'border-blue-800 bg-[#08122E]'
                    }`}
                  >
                    <div className="px-4 py-3 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-lg">20</div>
                    <div className="px-3 py-3 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-400" />

                  {/* Node 30 */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      opStep === 3
                        ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_24px_rgba(16,185,129,0.7)] scale-105'
                        : 'border-blue-800 bg-[#08122E]'
                    }`}
                  >
                    <div className="px-4 py-3 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-lg">30</div>
                    <div className="px-3 py-3 font-mono text-xs text-rose-400">NULL</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-rose-400" />
                  <span className="px-2.5 py-1.5 rounded border border-rose-500 font-mono text-xs text-rose-300">NULL</span>
                </div>
              )}

              {/* OPERATION 4: INSERTION AT SPECIFIC POSITION (HEAD → 10 → [ 15 ] → 20 → 30 → NULL) */}
              {currentOp.id === 'insert-position' && (
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-blue-600 rounded text-xs font-mono font-bold">HEAD</div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 10 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-700 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">10</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>

                  <ArrowRight
                    className={`w-5 h-5 transition-all ${
                      opStep >= 2 ? 'text-emerald-400 animate-pulse' : 'text-blue-400'
                    }`}
                  />

                  {/* New Node 15 Being Inserted */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-500 ${
                      opStep >= 1
                        ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_24px_rgba(16,185,129,0.8)] translate-y-0 scale-105'
                        : 'border-dashed border-cyan-400/70 -translate-y-4 opacity-40'
                    }`}
                  >
                    <div className="px-3 py-2.5 bg-emerald-900/60 border-r border-emerald-700 font-mono font-extrabold text-emerald-200">
                      15 (NEW)
                    </div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-emerald-300">NEXT</div>
                  </div>

                  <ArrowRight className="w-5 h-5 text-emerald-400" />

                  {/* Node 20 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-700 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">20</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 30 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-700 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">30</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-rose-400">NULL</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <span className="px-2 py-1 rounded border border-rose-500 font-mono text-xs text-rose-300">NULL</span>
                </div>
              )}

              {/* OPERATION 7: DELETION (10 → 20 → 30 → NULL ==> 10 → 30 → NULL) */}
              {currentOp.id === 'delete-specific' && (
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-blue-600 rounded text-xs font-mono font-bold">HEAD</div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 10 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-700 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">10</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>

                  {opStep < 2 ? (
                    <>
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                      {/* Node 20 (Target for deletion) */}
                      <div
                        className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          opStep === 1
                            ? 'border-rose-500 bg-rose-950/60 shadow-[0_0_20px_rgba(244,63,94,0.7)] scale-95 opacity-80 line-through'
                            : 'border-blue-700 bg-[#08122E]'
                        }`}
                      >
                        <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-rose-300">
                          20
                        </div>
                        <div className="px-2.5 py-2.5 font-mono text-xs text-rose-400">NEXT</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </>
                  ) : (
                    /* Rewired Bypass Pointer */
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500 text-emerald-300 font-mono text-xs font-bold animate-pulse">
                      <span>10-&gt;next = 30 (REWIRED)</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}

                  {/* Node 30 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-700 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">30</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-rose-400">NULL</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <span className="px-2 py-1 rounded border border-rose-500 font-mono text-xs text-rose-300">NULL</span>
                </div>
              )}

              {/* OPERATION 8: SEARCHING (Highlighting nodes one by one) */}
              {currentOp.id === 'searching' && (
                <div className="flex items-center gap-3">
                  <div className="px-2 py-1 bg-blue-600 rounded text-xs font-mono font-bold">HEAD</div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 10 */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      opStep === 1
                        ? 'border-amber-400 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                        : 'border-blue-800 bg-[#08122E]'
                    }`}
                  >
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">10</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 20 (Found Target!) */}
                  <div
                    className={`flex items-center rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      opStep >= 2
                        ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_24px_rgba(16,185,129,0.8)] scale-105'
                        : 'border-blue-800 bg-[#08122E]'
                    }`}
                  >
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-extrabold text-emerald-300">
                      20 {opStep >= 2 ? '✓' : ''}
                    </div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  {/* Node 30 */}
                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-800 bg-[#08122E]">
                    <div className="px-3 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold">30</div>
                    <div className="px-2.5 py-2.5 font-mono text-xs text-rose-400">NULL</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <span className="px-2 py-1 rounded border border-rose-500 font-mono text-xs text-rose-300">NULL</span>
                </div>
              )}

              {/* FALLBACK FOR OTHER OPERATIONS (INSERT HEAD, INSERT TAIL, DELETE HEAD, ETC.) */}
              {!['traversal', 'insert-position', 'delete-specific', 'searching'].includes(currentOp.id) && (
                <div className="flex items-center gap-3">
                  <div className="px-2.5 py-1 bg-blue-600 rounded text-xs font-mono font-bold">HEAD</div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.4)]">
                    <div className="px-4 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-base">10</div>
                    <div className="px-3 py-2.5 bg-[#07112B] font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.4)]">
                    <div className="px-4 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-base">20</div>
                    <div className="px-3 py-2.5 bg-[#07112B] font-mono text-xs text-cyan-300">NEXT</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-400" />

                  <div className="flex items-center rounded-xl overflow-hidden border-2 border-blue-500 shadow-[0_0_16px_rgba(37,99,235,0.4)]">
                    <div className="px-4 py-2.5 bg-[#0B1A40] border-r border-blue-800 font-mono font-bold text-base">30</div>
                    <div className="px-3 py-2.5 bg-[#07112B] font-mono text-xs text-rose-400">NULL</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-rose-400" />
                  <span className="px-2.5 py-1 rounded border border-rose-500 font-mono text-xs text-rose-300">NULL</span>
                </div>
              )}
            </div>

            {/* Active Operation Breakdown Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#091433]/80 border border-blue-700/50 backdrop-blur-md shadow-lg space-y-2">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-600 text-white">
                    OPERATION {currentOp.number} / 09
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white font-sans">
                    {currentOp.title}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
                  {currentOp.complexity}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {currentOp.description}
              </p>
            </div>
          </div>
        )}

        {/* AlgoLearn Watermark at Bottom-Right Corner (Non-blocking, Semi-transparent) */}
        <div className="absolute bottom-4 right-4 sm:right-6 pointer-events-none opacity-45 hover:opacity-80 transition-opacity select-none z-20 flex items-center gap-1.5">
          <img
            src="/algolearn-logo-dark.png"
            alt="AlgoLearn Watermark"
            className="h-4 sm:h-5 w-auto object-contain drop-shadow"
          />
        </div>
      </div>

      {/* Interactive Selection Tabs at Bottom */}
      <div className="p-4 bg-[#070E24] border-t border-blue-900/50 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-wider">
            {isLesson1 ? 'Explore 8 Core Concepts' : 'Explore 9 Linked List Operations'}
          </span>

          {/* Stepper Controls */}
          <div className="flex items-center gap-2">
            {isLesson1 ? (
              <>
                <button
                  onClick={() => setIsConceptAutoPlaying((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {isConceptAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isConceptAutoPlaying ? 'PAUSE' : 'AUTO PLAY'}</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setConceptIndex((prev) => (prev + 1) % VIDEO_1_CONCEPTS.length);
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/50 cursor-pointer"
                  title="Next Concept"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsOpPlaying((prev) => !prev)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold font-mono bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  {isOpPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isOpPlaying ? 'PAUSE' : 'PLAY STEPPER'}</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setOpStep((prev) => (prev + 1) % 4);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/50 text-blue-300 cursor-pointer flex items-center gap-1"
                  title="Step Animation"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  <span>STEP ({opStep}/3)</span>
                </button>
                <button
                  onClick={() => {
                    soundManager.playClick();
                    setOpStep(0);
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/60 border border-blue-800/50 cursor-pointer"
                  title="Reset Step"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Horizontal Scrollable Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {isLesson1
            ? VIDEO_1_CONCEPTS.map((concept, idx) => (
                <button
                  key={concept.id}
                  onClick={() => handleSelectConcept(idx)}
                  className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer border ${
                    conceptIndex === idx
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#091433]/70 hover:bg-[#0B1A40] border-blue-900/50 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold opacity-80">
                    CONCEPT {concept.number}
                  </div>
                  <div className="text-xs font-bold font-sans truncate max-w-[160px]">
                    {concept.title}
                  </div>
                </button>
              ))
            : VIDEO_2_OPERATIONS.map((op, idx) => (
                <button
                  key={op.id}
                  onClick={() => handleSelectOperation(idx)}
                  className={`px-3 py-2 rounded-xl text-left shrink-0 transition-all cursor-pointer border ${
                    opIndex === idx
                      ? 'bg-blue-600 border-cyan-400 text-white shadow-md shadow-blue-500/20'
                      : 'bg-[#091433]/70 hover:bg-[#0B1A40] border-blue-900/50 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold opacity-80">
                    OP {op.number}
                  </div>
                  <div className="text-xs font-bold font-sans truncate max-w-[160px]">
                    {op.title}
                  </div>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
};
