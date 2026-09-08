import React from 'react';
import {
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  BookOpen,
  Clock,
  Layers,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export interface DeletionSectionHubProps {
  onSelectConcept: (conceptId: string) => void;
  onPracticeConcept?: (conceptId: string) => void;
  completedConcepts: string[];
}

export const DeletionSectionHub: React.FC<DeletionSectionHubProps> = ({
  onSelectConcept,
  onPracticeConcept,
  completedConcepts,
}) => {
  const concepts = [
    {
      id: 'delete-beginning',
      number: '01',
      title: 'Delete at Beginning',
      complexity: 'O(1)',
      timeCategory: 'Constant Time',
      badge: 'Fastest',
      readTime: '3 MIN',
      description:
        'Advance the HEAD pointer directly to the second node (head = head->next), then deallocate the original head node from the Heap.',
      keyPointers: 'HEAD = HEAD.next; free(temp);',
      diagram: 'HEAD → [10] → [20] → [30]  ===>  HEAD → [20] → [30]',
      xp: 40,
    },
    {
      id: 'delete-end',
      number: '02',
      title: 'Delete at End',
      complexity: 'O(n)',
      timeCategory: 'Linear Time',
      badge: 'Traversal',
      readTime: '4 MIN',
      description:
        'Traverse sequentially to locate the second-to-last node, set its NEXT pointer to NULL, and free the former TAIL node.',
      keyPointers: 'curr->next = NULL; free(tail);',
      diagram: 'HEAD → [10] → [20] → [30]  ===>  HEAD → [10] → [20] → NULL',
      xp: 45,
    },
    {
      id: 'delete-position',
      number: '03',
      title: 'Delete at Any Position',
      complexity: 'O(n)',
      timeCategory: 'Linear Time',
      badge: 'Bypass',
      readTime: '4 MIN',
      description:
        'Traverse to node (k - 1), bypass the target node by pointing directly to target.next, and release the isolated target node.',
      keyPointers: 'prev->next = target->next; free(target);',
      diagram: '20 → [30] → 40  ===>  20 ─────────→ 40',
      xp: 50,
    },
  ];

  return (
    <div className="w-full space-y-6 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* 1. DELETION SECTION HEADER */}
      <div className="border border-slate-200 dark:border-blue-900/30 rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#0B1228] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 rounded-md text-xs font-semibold uppercase tracking-wider font-mono">
              OPERATIONS // VOL. 02
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-sans">
              Linked List Memory Deallocation
            </span>
          </div>

          <div className="text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#080D1F] px-3 py-1 rounded-lg border border-slate-200 dark:border-blue-900/25">
            3 Deletion Operations
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 shadow-2xs">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Deletion Operations in Singly Linked List
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Deleting a node in a linked list requires bypassing its pointer and deallocating its memory so there are no dangling references or memory leaks. Choose an operation below to study its theory and practice interactively.
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE THREE MAIN DELETION CONCEPTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Select a Deletion Concept
          </h3>
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold">
            3 Core Operations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {concepts.map((concept) => {
            const isCompleted =
              completedConcepts.includes(concept.id) ||
              completedConcepts.includes(`theory-0${concept.id === 'delete-beginning' ? '6' : concept.id === 'delete-end' ? '7' : '8'}`);

            return (
              <div
                key={concept.id}
                id={`card-deletion-${concept.id}`}
                className="group flex flex-col justify-between p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 hover:border-blue-500 dark:hover:border-blue-400 shadow-xs hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-200 cursor-pointer"
                onClick={() => {
                  soundManager.playSelect();
                  onSelectConcept(concept.id);
                }}
              >
                <div className="space-y-3.5">
                  {/* Card Header: Number, Badge, & Completed */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 font-mono text-xs font-black flex items-center justify-center">
                        {concept.number}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-slate-100 dark:bg-[#0F1733] text-slate-700 dark:text-slate-300">
                        {concept.complexity}
                      </span>
                    </div>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-sans text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{concept.readTime}</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {concept.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1.5 line-clamp-3">
                      {concept.description}
                    </p>
                  </div>

                  {/* Pointer snippet preview */}
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#080D1F] border border-slate-100 dark:border-blue-900/25 font-mono text-[11px] text-blue-600 dark:text-blue-300">
                    <code>{concept.keyPointers}</code>
                  </div>
                </div>

                {/* Card Actions: Open Lesson / Practice Task */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-blue-900/20 flex items-center gap-2">
                  <button
                    id={`btn-open-${concept.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playSelect();
                      onSelectConcept(concept.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Lesson</span>
                  </button>

                  {onPracticeConcept && (
                    <button
                      id={`btn-practice-${concept.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        soundManager.playSelect();
                        onPracticeConcept(concept.id);
                      }}
                      className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-[#0F1733] hover:bg-slate-200 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1 cursor-pointer transition-all border border-slate-200 dark:border-blue-900/30"
                      title="Practice this deletion in Game Mode"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>+{concept.xp} XP</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. COMPARISON SUMMARY TABLE */}
      <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Deletion Operations Comparison Matrix</span>
        </h3>

        <div className="overflow-x-auto border border-slate-200 dark:border-blue-900/25 rounded-xl">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-50 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-blue-900/25 uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Time Complexity</th>
                <th className="px-4 py-3">Key Pointer Action</th>
                <th className="px-4 py-3">Crucial Edge Case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-900/15">
              <tr className="hover:bg-slate-50/60 dark:hover:bg-[#0F1733] transition-colors">
                <td className="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">
                  1. Delete at Beginning
                </td>
                <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">
                  O(1) Constant
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  HEAD = HEAD.next
                </td>
                <td className="px-4 py-3 text-rose-600 dark:text-rose-400">
                  List is empty (head == NULL)
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-[#0F1733] transition-colors">
                <td className="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">
                  2. Delete at End
                </td>
                <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                  O(n) Linear
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  curr.next = NULL
                </td>
                <td className="px-4 py-3 text-rose-600 dark:text-rose-400">
                  Single-node list (head.next == NULL)
                </td>
              </tr>
              <tr className="hover:bg-slate-50/60 dark:hover:bg-[#0F1733] transition-colors">
                <td className="px-4 py-3 font-sans font-bold text-slate-900 dark:text-white">
                  3. Delete at Any Position
                </td>
                <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">
                  O(n) Linear
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                  prev.next = target.next
                </td>
                <td className="px-4 py-3 text-rose-600 dark:text-rose-400">
                  Position 1 or position &gt; length
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
