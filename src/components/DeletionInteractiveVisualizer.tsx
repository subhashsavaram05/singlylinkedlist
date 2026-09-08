import React, { useState } from 'react';
import { Play, RotateCcw, ChevronRight, ChevronLeft, Zap, CheckCircle2, Trash2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type DeletionConceptType = 'delete-beginning' | 'delete-end' | 'delete-position';

interface DeletionInteractiveVisualizerProps {
  conceptId: DeletionConceptType;
}

interface StepInfo {
  step: number;
  title: string;
  description: string;
  codeSnippet: string;
  nodes: Array<{
    id: string;
    data: number;
    address: number;
    nextAddress: number | null;
    status: 'normal' | 'head' | 'target' | 'freed' | 'bypassed';
  }>;
  pointers: {
    head?: number | null;
    temp?: number | null;
    curr?: number | null;
    prev?: number | null;
  };
}

export const DeletionInteractiveVisualizer: React.FC<DeletionInteractiveVisualizerProps> = ({ conceptId }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Define steps for each deletion concept
  const getSteps = (): StepInfo[] => {
    if (conceptId === 'delete-beginning') {
      return [
        {
          step: 1,
          title: 'Initial Linked List State',
          description: 'We have 3 nodes [10 → 20 → 30]. The HEAD pointer points to the first node (Address 1001 with value 10).',
          codeSnippet: 'Node* temp = head; // Prepare to capture current HEAD',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, temp: null },
        },
        {
          step: 2,
          title: 'Save Reference to Current HEAD',
          description: 'Store head in temporary pointer temp. This holds the address (1001) so we can safely free its memory later.',
          codeSnippet: 'Node* temp = head; // temp points to Node 10 (1001)',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'target' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, temp: 1001 },
        },
        {
          step: 3,
          title: 'Advance HEAD to HEAD.next',
          description: 'Move HEAD pointer to the second node (Node 20 at Address 1002). Node 10 is now decoupled from the list head.',
          codeSnippet: 'head = head->next; // head is now 1002 (Node 20)',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'bypassed' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'head' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1002, temp: 1001 },
        },
        {
          step: 4,
          title: 'Deallocate Memory (free temp)',
          description: 'Release the heap memory allocated for Node 10 using free(temp) or delete. Operation completed in O(1) constant time!',
          codeSnippet: 'free(temp); // Node 10 destroyed, heap memory recovered',
          nodes: [
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'head' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1002, temp: null },
        },
      ];
    } else if (conceptId === 'delete-end') {
      return [
        {
          step: 1,
          title: 'Initial Linked List State',
          description: 'We have 3 nodes [10 → 20 → 30]. We want to delete the last node (Node 30 at Address 1003).',
          codeSnippet: 'Node* curr = head;',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, curr: 1001 },
        },
        {
          step: 2,
          title: 'Traverse to Second-to-Last Node',
          description: 'Traverse using curr until curr->next->next is NULL. Pointer curr stops at Node 20 (the predecessor of TAIL).',
          codeSnippet: 'while (curr->next->next != nullptr) { curr = curr->next; }',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'target' },
          ],
          pointers: { head: 1001, curr: 1002 },
        },
        {
          step: 3,
          title: 'Store Tail and Break Link',
          description: 'Save temp = curr->next (Node 30), then set curr->next = NULL. Node 20 is now the new TAIL.',
          codeSnippet: 'Node* temp = curr->next;\ncurr->next = nullptr;',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: null, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: null, status: 'bypassed' },
          ],
          pointers: { head: 1001, curr: 1002, temp: 1003 },
        },
        {
          step: 4,
          title: 'Free Old Tail Memory',
          description: 'Deallocate Node 30 with free(temp). The list now ends cleanly at Node 20. Total time: O(n).',
          codeSnippet: 'free(temp); // Tail node deleted successfully',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, curr: 1002, temp: null },
        },
      ];
    } else {
      // delete-position
      return [
        {
          step: 1,
          title: 'Initial List State (Target: Position 3)',
          description: 'We have 4 nodes [10 → 20 → 30 → 40]. We want to delete the node at position 3 (Node 30 at Address 1003).',
          codeSnippet: 'int position = 3;\nNode* prev = head;',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: 1004, status: 'target' },
            { id: 'n4', data: 40, address: 1004, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, prev: 1001 },
        },
        {
          step: 2,
          title: 'Traverse to Node at (Position - 1)',
          description: 'Loop until prev reaches node 2 (Address 1002). This is the node immediately before the deletion target.',
          codeSnippet: 'for (int i = 1; i < position - 1; i++) prev = prev->next;',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1003, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: 1004, status: 'target' },
            { id: 'n4', data: 40, address: 1004, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, prev: 1002 },
        },
        {
          step: 3,
          title: 'Bypass the Target Node',
          description: 'Set prev->next = target->next. Pointer of Node 20 now skips Node 30 and connects directly to Node 40!',
          codeSnippet: 'Node* target = prev->next; // 1003\nprev->next = target->next; // 20 -> 40',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1004, status: 'normal' },
            { id: 'n3', data: 30, address: 1003, nextAddress: 1004, status: 'bypassed' },
            { id: 'n4', data: 40, address: 1004, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, prev: 1002, temp: 1003 },
        },
        {
          step: 4,
          title: 'Free Target Memory',
          description: 'Deallocate the isolated Node 30 with free(target). The remaining chain [10 → 20 → 40] is intact. Total time: O(n).',
          codeSnippet: 'free(target); // Node 30 released cleanly',
          nodes: [
            { id: 'n1', data: 10, address: 1001, nextAddress: 1002, status: 'head' },
            { id: 'n2', data: 20, address: 1002, nextAddress: 1004, status: 'normal' },
            { id: 'n4', data: 40, address: 1004, nextAddress: null, status: 'normal' },
          ],
          pointers: { head: 1001, prev: 1002, temp: null },
        },
      ];
    }
  };

  const steps = getSteps();
  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    soundManager.playStep();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    soundManager.playStep();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    soundManager.playReset();
    setCurrentStepIndex(0);
  };

  return (
    <div className="bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-blue-900/30 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 font-sans">
      {/* Visualizer Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-blue-900/20 pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
              Interactive Memory & Pointer Visualizer
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-sans">
              Step {currentStep.step} of {steps.length}: {currentStep.title}
            </span>
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-blue-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F1733] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-bold px-2 py-1 bg-slate-100 dark:bg-[#080D1F] rounded-md text-slate-700 dark:text-slate-300">
            {currentStepIndex + 1} / {steps.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-blue-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F1733] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-blue-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0F1733] cursor-pointer transition-all ml-1"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Linked List Canvas Display */}
      <div className="bg-slate-50/70 dark:bg-[#080D1F] border border-slate-200 dark:border-blue-900/25 rounded-xl p-5 overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max py-4">
          {currentStep.nodes.map((node, idx) => {
            const isHead = currentStep.pointers.head === node.address;
            const isTemp = currentStep.pointers.temp === node.address;
            const isCurr = currentStep.pointers.curr === node.address;
            const isPrev = currentStep.pointers.prev === node.address;

            let borderStyle = 'border-slate-300 dark:border-blue-900/40';
            let bgData = 'bg-white dark:bg-[#0B1228]';
            let textData = 'text-slate-900 dark:text-white';

            if (node.status === 'target' || isTemp) {
              borderStyle = 'border-rose-400 dark:border-rose-500/80 shadow-md shadow-rose-500/10';
              bgData = 'bg-rose-50 dark:bg-rose-950/50';
              textData = 'text-rose-700 dark:text-rose-300';
            } else if (node.status === 'bypassed') {
              borderStyle = 'border-dashed border-rose-300 dark:border-rose-800/60 opacity-60';
              bgData = 'bg-rose-50/40 dark:bg-rose-950/20';
              textData = 'text-rose-400 dark:text-rose-400 line-through';
            } else if (isHead) {
              borderStyle = 'border-blue-500 dark:border-blue-400 shadow-md shadow-blue-500/10';
              bgData = 'bg-blue-50/60 dark:bg-blue-950/50';
              textData = 'text-blue-700 dark:text-blue-300';
            }

            return (
              <div key={node.id} className="flex items-center gap-2">
                {/* Node Box with Memory Metadata */}
                <div className="flex flex-col items-center gap-1.5">
                  {/* Pointers floating above */}
                  <div className="h-6 flex items-center gap-1 font-mono text-[10px] font-bold">
                    {isHead && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white shadow-2xs">
                        HEAD
                      </span>
                    )}
                    {isTemp && (
                      <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white shadow-2xs">
                        temp
                      </span>
                    )}
                    {isCurr && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white shadow-2xs">
                        curr
                      </span>
                    )}
                    {isPrev && (
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white shadow-2xs">
                        prev
                      </span>
                    )}
                  </div>

                  {/* The Two-Cell Node */}
                  <div className={`flex border-2 rounded-xl overflow-hidden shadow-xs transition-all duration-200 ${borderStyle}`}>
                    {/* Data cell */}
                    <div className={`px-4 py-3 font-mono font-black text-sm sm:text-base border-r border-slate-200 dark:border-blue-900/30 min-w-[54px] text-center ${bgData} ${textData}`}>
                      {node.data}
                    </div>
                    {/* Next Pointer Cell */}
                    <div className="px-3 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-[#070B18] flex items-center justify-center min-w-[50px]">
                      {node.nextAddress ? node.nextAddress : 'NULL'}
                    </div>
                  </div>

                  {/* Address Badge underneath */}
                  <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    addr: {node.address}
                  </div>
                </div>

                {/* Arrow to Next Node or NULL */}
                <div className="flex items-center text-blue-500 dark:text-blue-400 font-bold px-1">
                  {node.nextAddress ? (
                    <span className="text-xl">→</span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-slate-200/80 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                      NULL
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Explanation & Live Code Snippet */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
        <div className="md:col-span-7 space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
            <span>Step {currentStep.step}: {currentStep.title}</span>
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        <div className="md:col-span-5 bg-[#F8FAFC] dark:bg-[#050816] border border-slate-200 dark:border-blue-900/30 rounded-xl p-3 font-mono text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Operation Code
          </span>
          <pre className="text-blue-700 dark:text-blue-300 font-bold whitespace-pre-wrap">
            {currentStep.codeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
