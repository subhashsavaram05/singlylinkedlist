import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Link as LinkIcon,
  Trash2,
  HelpCircle,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Check,
  CheckCircle2,
  XCircle,
  MousePointerClick,
  Keyboard,
  Info,
} from 'lucide-react';
import { SLLNode, SLLPointerState, SLLActionModalType, SLLTaskDef, SLLTeacherStep } from '../../types/sllGame';

interface SLLActionModalProps {
  modalType: SLLActionModalType;
  onClose: () => void;
  nodes: SLLNode[];
  pointers: SLLPointerState;
  activeTask: SLLTaskDef;
  selectedAddress: number | null;
  onCreateNode: (data: number, address: number, nextAddress: number | null) => void;
  onChangeNext: (fromAddress: number, toNextAddress: number | null) => void;
  onSetHead: (address: number | null) => void;
  onSetTail: (address: number | null) => void;
  onDeleteNode: (address: number) => void;
  hintLevel: number;
  onAdvanceHint: () => void;
  currentTeacherStep?: SLLTeacherStep | null;
}

export const SLLActionModal: React.FC<SLLActionModalProps> = ({
  modalType,
  onClose,
  nodes,
  pointers,
  activeTask,
  selectedAddress,
  onCreateNode,
  onChangeNext,
  onSetHead,
  onSetTail,
  onDeleteNode,
  hintLevel,
  onAdvanceHint,
  currentTeacherStep,
}) => {
  // Compute next available unique address default
  const existingAddresses = nodes.map((n) => n.address);
  const defaultAddr = existingAddresses.length > 0 ? Math.max(...existingAddresses) + 1 : 1001;

  // Form states
  const [dataInput, setDataInput] = useState<string>('');
  const [addressInput, setAddressInput] = useState<string>('');
  const [nextInput, setNextInput] = useState<string>('NULL');

  // Change Next state
  const [changeNextMode, setChangeNextMode] = useState<'SELECT' | 'MANUAL'>('SELECT');
  const [targetNodeAddr, setTargetNodeAddr] = useState<number | null>(null);
  const [selectedNextAddr, setSelectedNextAddr] = useState<number | null | undefined>(undefined);
  const [newNextInput, setNewNextInput] = useState<string>('NULL');
  const [manualError, setManualError] = useState<string | null>(null);

  // Pointer state
  const [headInput, setHeadInput] = useState<string>('');
  const [tailInput, setTailInput] = useState<string>('');

  // Delete state
  const [deleteAddr, setDeleteAddr] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Initialize form fields based on task or selection
  useEffect(() => {
    setFormError(null);
    if (modalType === 'CREATE_NODE') {
      let defData = activeTask.defaultInputValues?.data !== undefined ? String(activeTask.defaultInputValues.data) : '';
      if (activeTask.id === 'L1_T1') {
        if (nodes.some((n) => n.data === 10)) {
          defData = '20';
        } else {
          defData = '10';
        }
      }
      const defAddr = String(defaultAddr);
      const defNext = 'NULL';
      setDataInput(defData);
      setAddressInput(defAddr);
      setNextInput(defNext);
    } else if (modalType === 'CHANGE_NEXT') {
      const initialTarget =
        selectedAddress !== null && nodes.some((n) => n.address === selectedAddress)
          ? selectedAddress
          : nodes.length > 0
          ? nodes[0].address
          : null;
      setTargetNodeAddr(initialTarget);
      setChangeNextMode('SELECT');
      setManualError(null);

      if (initialTarget !== null) {
        const found = nodes.find((n) => n.address === initialTarget);
        const currNext = found?.nextAddress ?? null;
        setSelectedNextAddr(currNext);
        setNewNextInput(currNext !== null ? String(currNext) : 'NULL');
      } else {
        setSelectedNextAddr(undefined);
        setNewNextInput('NULL');
      }
    } else if (modalType === 'SET_HEAD') {
      const val = activeTask.defaultInputValues?.head !== undefined ? String(activeTask.defaultInputValues.head) : (pointers.headAddress !== null ? String(pointers.headAddress) : 'NULL');
      setHeadInput(val);
    } else if (modalType === 'SET_TAIL') {
      const val = activeTask.defaultInputValues?.tail !== undefined ? String(activeTask.defaultInputValues.tail) : (pointers.tailAddress !== null ? String(pointers.tailAddress) : 'NULL');
      setTailInput(val);
    } else if (modalType === 'DELETE_NODE') {
      setDeleteAddr(selectedAddress || (nodes.length > 0 ? nodes[0].address : null));
    }
  }, [modalType, activeTask, selectedAddress, nodes.length]);

  const sourceNode = useMemo(() => {
    return nodes.find((n) => n.address === targetNodeAddr) || null;
  }, [nodes, targetNodeAddr]);

  const destNode = useMemo(() => {
    return selectedNextAddr !== undefined && selectedNextAddr !== null
      ? nodes.find((n) => n.address === selectedNextAddr) || null
      : null;
  }, [nodes, selectedNextAddr]);

  // Determine recommended node to connect to for guided learning
  const recommendedNextAddr = useMemo(() => {
    if (currentTeacherStep?.actionType === 'connect_next' && currentTeacherStep.nextAddress !== undefined) {
      return currentTeacherStep.nextAddress;
    }
    if (activeTask.id === 'L1_T1') {
      const n20 = nodes.find((n) => n.data === 20);
      return n20?.address ?? null;
    }
    return undefined;
  }, [currentTeacherStep, activeTask.id, nodes]);

  const handleSelectSourceNode = (addr: number) => {
    setTargetNodeAddr(addr);
    const found = nodes.find((n) => n.address === addr);
    const currNext = found?.nextAddress ?? null;
    setSelectedNextAddr(currNext);
    setNewNextInput(currNext !== null ? String(currNext) : 'NULL');
    setManualError(null);
  };

  const handleSelectNextNode = (addr: number | null) => {
    if (addr !== null && addr === targetNodeAddr) {
      return; // Cannot connect to self
    }
    setSelectedNextAddr(addr);
    setNewNextInput(addr !== null ? String(addr) : 'NULL');
    setManualError(null);
  };

  const handleApplyNextConnection = () => {
    setFormError(null);
    if (targetNodeAddr === null) {
      setFormError('Please select a source node to update.');
      return;
    }
    const finalNext = selectedNextAddr !== undefined ? selectedNextAddr : null;
    onChangeNext(targetNodeAddr, finalNext);
    onClose();
  };

  const handleManualInputChange = (val: string) => {
    setNewNextInput(val);
    const trimmed = val.trim();
    if (trimmed.toUpperCase() === 'NULL' || trimmed === '') {
      setManualError(null);
      setSelectedNextAddr(null);
      return;
    }
    const parsed = parseInt(trimmed, 10);
    if (isNaN(parsed)) {
      setManualError('Please enter a valid numeric address or "NULL".');
      return;
    }
    if (targetNodeAddr !== null && parsed === targetNodeAddr) {
      setManualError('A node cannot point to itself. Please select another node.');
      return;
    }
    const exists = nodes.some((n) => n.address === parsed);
    if (!exists) {
      setManualError('Address not found: Please select a valid node or enter one of the available addresses.');
      return;
    }
    setManualError(null);
    setSelectedNextAddr(parsed);
  };

  if (modalType === 'NONE') return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const dataNum = parseInt(dataInput, 10);
    const addrNum = parseInt(addressInput, 10);

    if (isNaN(dataNum)) {
      setFormError('Please enter a valid numeric DATA value.');
      return;
    }
    if (isNaN(addrNum) || addrNum <= 0) {
      setFormError('Please enter a valid positive memory address (e.g. 1001, 1002).');
      return;
    }
    if (nodes.some((n) => n.address === addrNum)) {
      setFormError(`Memory collision! Address ${addrNum} is already occupied by another node.`);
      return;
    }

    let nextVal: number | null = null;
    if (nextInput.trim().toUpperCase() !== 'NULL' && nextInput.trim() !== '') {
      const parsedNext = parseInt(nextInput, 10);
      if (isNaN(parsedNext)) {
        setFormError('NEXT pointer must be a valid numeric address or "NULL".');
        return;
      }
      nextVal = parsedNext;
    }

    onCreateNode(dataNum, addrNum, nextVal);
    onClose();
  };

  const handleChangeNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (targetNodeAddr === null) {
      setFormError('Please select a node to update.');
      return;
    }

    let nextVal: number | null = null;
    if (newNextInput.trim().toUpperCase() !== 'NULL' && newNextInput.trim() !== '') {
      const parsedNext = parseInt(newNextInput, 10);
      if (isNaN(parsedNext)) {
        setFormError('NEXT must be a valid numeric address or "NULL".');
        return;
      }
      nextVal = parsedNext;
    }

    onChangeNext(targetNodeAddr, nextVal);
    onClose();
  };

  const handleSetHeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    let headVal: number | null = null;
    if (headInput.trim().toUpperCase() !== 'NULL' && headInput.trim() !== '') {
      const parsed = parseInt(headInput, 10);
      if (isNaN(parsed)) {
        setFormError('HEAD must be a numeric address or "NULL".');
        return;
      }
      headVal = parsed;
    }
    onSetHead(headVal);
    onClose();
  };

  const handleSetTailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    let tailVal: number | null = null;
    if (tailInput.trim().toUpperCase() !== 'NULL' && tailInput.trim() !== '') {
      const parsed = parseInt(tailInput, 10);
      if (isNaN(parsed)) {
        setFormError('TAIL must be a numeric address or "NULL".');
        return;
      }
      tailVal = parsed;
    }
    onSetTail(tailVal);
    onClose();
  };

  const handleDeleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nodes.length === 0) {
      setFormError('Cannot delete. The linked list is empty (Underflow).');
      return;
    }
    if (deleteAddr === null) {
      setFormError('Please select a node to delete.');
      return;
    }
    onDeleteNode(deleteAddr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 10 }}
        className={`w-full ${modalType === 'CHANGE_NEXT' ? 'max-w-xl' : 'max-w-md'} bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-blue-900/40 rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col`}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-blue-900/20 flex items-center justify-between bg-slate-50/70 dark:bg-[#15203B] shrink-0">
          <div className="flex items-center gap-2.5">
            {modalType === 'CREATE_NODE' && (
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
            )}
            {modalType === 'CHANGE_NEXT' && (
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center">
                <LinkIcon className="w-4 h-4" />
              </div>
            )}
            {modalType === 'SET_HEAD' && (
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] dark:bg-blue-950 text-[#2563EB] dark:text-blue-400 flex items-center justify-center font-bold font-mono text-xs">
                HEAD
              </div>
            )}
            {modalType === 'SET_TAIL' && (
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold font-mono text-xs">
                TAIL
              </div>
            )}
            {modalType === 'DELETE_NODE' && (
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
            )}
            {modalType === 'HINT' && (
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
            )}

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                {modalType === 'CREATE_NODE' && 'Allocate & Create Node'}
                {modalType === 'CHANGE_NEXT' && 'Connect NEXT Pointer'}
                {modalType === 'SET_HEAD' && 'Set HEAD Pointer'}
                {modalType === 'SET_TAIL' && 'Set TAIL Pointer'}
                {modalType === 'DELETE_NODE' && 'Deallocate / Delete Node'}
                {modalType === 'HINT' && 'Interactive 3-Tier Hint'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {modalType === 'CREATE_NODE' && 'Allocate Heap RAM memory for a new node'}
                {modalType === 'CHANGE_NEXT' && "Link a node's NEXT pointer to another node's memory address"}
                {modalType === 'SET_HEAD' && 'Update address of first node in list'}
                {modalType === 'SET_TAIL' && 'Update address of last node in list'}
                {modalType === 'DELETE_NODE' && 'Free memory allocated to a node (free(node))'}
                {modalType === 'HINT' && 'Progressive hints without giving away the exact answer'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(92vh-80px)]">
          {formError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* CREATE NODE FORM */}
          {modalType === 'CREATE_NODE' && (
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  1. DATA Value (Integer)
                </label>
                <input
                  type="number"
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  placeholder="e.g. 10, 20, 30"
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  2. Memory Address (Heap RAM Location)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="e.g. 1001, 1002"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAddressInput(String(defaultAddr))}
                    className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-900/30 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    Auto ({defaultAddr})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  3. NEXT Pointer (Address or NULL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nextInput}
                    onChange={(e) => setNextInput(e.target.value)}
                    placeholder="e.g. 1002 or NULL"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setNextInput('NULL')}
                    className="px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                  >
                    NULL
                  </button>
                </div>
              </div>

              {/* Quick Node Addresses Pills */}
              {nodes.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block mb-1">
                    Existing Node Addresses:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.map((n) => (
                      <button
                        key={n.address}
                        type="button"
                        onClick={() => setNextInput(String(n.address))}
                        className="px-2 py-1 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/50 border border-[#BFDBFE] dark:border-blue-500/30 text-[11px] font-mono font-semibold text-[#2563EB] dark:text-blue-300 hover:bg-[#DBEAFE]"
                      >
                        {n.address} [Data:{n.data}]
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Allocate Node</span>
                </button>
              </div>
            </form>
          )}

          {/* CHANGE NEXT POINTER FORM - NEW USER-FRIENDLY INTERACTION */}
          {modalType === 'CHANGE_NEXT' && (
            <div className="space-y-4">
              {/* EDUCATIONAL GUIDANCE: HOW NEXT WORKS */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40">
                <div className="flex items-center gap-1.5 font-bold text-blue-950 dark:text-blue-200 text-xs mb-1">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="tracking-wider uppercase font-mono text-[11px]">HOW NEXT WORKS</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                  Each node stores the <strong>memory address</strong> of the next node.
                </p>
                <div className="mt-1.5 p-2 rounded-xl bg-white/80 dark:bg-[#0A1026] border border-blue-100 dark:border-blue-900/30 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Node 10 NEXT = 1002</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">
                    means Node 10 points to Node 20 because Node 20 is stored at Address 1002.
                  </span>
                </div>
              </div>

              {/* MODE TOGGLE TABS */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-[#15203B] border border-slate-200/70 dark:border-blue-900/30">
                <button
                  type="button"
                  onClick={() => setChangeNextMode('SELECT')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    changeNextMode === 'SELECT'
                      ? 'bg-white dark:bg-[#0E1736] text-[#2563EB] dark:text-blue-300 shadow-xs ring-1 ring-slate-200 dark:ring-blue-900/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
                  <span>Select Node (Recommended)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChangeNextMode('MANUAL')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    changeNextMode === 'MANUAL'
                      ? 'bg-white dark:bg-[#0E1736] text-[#2563EB] dark:text-blue-300 shadow-xs ring-1 ring-slate-200 dark:ring-blue-900/40'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  <span>Enter Address Manually</span>
                </button>
              </div>

              {/* STEP 1: SELECT THE CURRENT NODE (SOURCE) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                      1
                    </span>
                    <span>Connecting Node (Source)</span>
                  </label>
                  {nodes.length > 1 && (
                    <span className="text-[10px] text-slate-400 font-mono">
                      Switch source node below if needed
                    </span>
                  )}
                </div>

                {/* Source Node Cards / Selector */}
                {nodes.length > 1 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {nodes.map((n) => {
                      const isSelected = targetNodeAddr === n.address;
                      return (
                        <button
                          key={n.address}
                          type="button"
                          onClick={() => handleSelectSourceNode(n.address)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-blue-950/60 ring-2 ring-blue-500/30 shadow-xs'
                              : 'border-slate-200 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#070B19] hover:border-slate-300 dark:hover:border-blue-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 dark:text-white">
                              Node {n.data}
                            </span>
                            {isSelected && (
                              <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-[#2563EB] dark:text-blue-400 block mt-0.5">
                            ADDR: {n.address}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : sourceNode ? (
                  <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-[#EFF6FF] dark:bg-blue-950/40 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Node {sourceNode.data}
                      </span>
                      <span className="text-xs font-mono text-[#2563EB] dark:text-blue-400 block">
                        Memory Address: {sourceNode.address}
                      </span>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded-md bg-white dark:bg-[#0E1736] border border-blue-200 dark:border-blue-900/30 text-slate-700 dark:text-slate-300">
                      Current NEXT: {sourceNode.nextAddress !== null ? sourceNode.nextAddress : 'NULL'}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Connecting arrow indicator */}
              <div className="flex items-center justify-center -my-1 text-slate-400 dark:text-slate-500">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700" />
                  <span className="text-xs font-bold font-mono">↓</span>
                </div>
              </div>

              {/* STEP 2: SELECT NEXT NODE (RECOMMENDED MODE) */}
              {changeNextMode === 'SELECT' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] flex items-center justify-center font-bold">
                        2
                      </span>
                      <span>Select The Next Node</span>
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Click to auto-fill address
                    </span>
                  </div>

                  <div className="space-y-2">
                    {nodes.map((n) => {
                      const isSelf = n.address === targetNodeAddr;
                      const isSelected = selectedNextAddr === n.address;
                      const isRecommended = recommendedNextAddr === n.address;

                      if (isSelf) {
                        return (
                          <div
                            key={n.address}
                            className="p-3 rounded-2xl border border-dashed border-slate-200 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#070B19]/50 opacity-50 flex items-center justify-between text-xs"
                          >
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                Node {n.data}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 ml-2">
                                ADDR: {n.address}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 italic">
                              ⚠ Cannot point to self
                            </span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={n.address}
                          onClick={() => handleSelectNextNode(n.address)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/60 ring-2 ring-blue-500/30 shadow-md'
                              : isRecommended
                              ? 'border-cyan-400 dark:border-cyan-500/60 bg-cyan-50/40 dark:bg-cyan-950/30 hover:border-cyan-500 hover:shadow-md'
                              : 'border-slate-200 dark:border-blue-900/30 bg-white dark:bg-[#070B19] hover:border-blue-400 dark:hover:border-blue-500/40 hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : isRecommended
                                  ? 'bg-cyan-100 dark:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300'
                                  : 'bg-slate-100 dark:bg-[#15203B] text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              {n.data}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">
                                  Node {n.data}
                                </span>
                                {isRecommended && (
                                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-mono bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                                    ★ Recommended
                                  </span>
                                )}
                              </div>
                              <span className="text-xs font-mono text-[#2563EB] dark:text-blue-300 font-bold block mt-0.5">
                                ADDRESS: {n.address}
                              </span>
                              {isRecommended && (
                                <span className="text-[11px] text-cyan-700 dark:text-cyan-300/90 block mt-0.5">
                                  Click Node {n.data} to automatically use its address ({n.address}).
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectNextNode(n.address);
                              }}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-300 hover:bg-blue-100 border border-blue-200 dark:border-blue-900/40'
                              }`}
                            >
                              {isSelected ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Selected</span>
                                </>
                              ) : (
                                <>
                                  <span>Connect</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* NULL Option (End of List) */}
                    <div
                      onClick={() => handleSelectNextNode(null)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        selectedNextAddr === null
                          ? 'border-rose-500 bg-rose-50/80 dark:bg-rose-950/60 ring-2 ring-rose-500/30 shadow-md'
                          : 'border-slate-200 dark:border-blue-900/30 bg-white dark:bg-[#070B19] hover:border-rose-300 hover:bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            selectedNextAddr === null
                              ? 'bg-rose-600 text-white'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          NULL
                        </div>
                        <div>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            NULL (End of List)
                          </span>
                          <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-bold block mt-0.5">
                            ADDRESS: NULL
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                            Terminal pointer marking the end of the Singly Linked List.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectNextNode(null);
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            selectedNextAddr === null
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 border border-rose-200 dark:border-rose-900/40'
                          }`}
                        >
                          {selectedNextAddr === null ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Selected</span>
                            </>
                          ) : (
                            <span>Set to NULL</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* VISUAL CONNECTION & AUTO-FILLED EXPLANATION */}
                  {selectedNextAddr !== undefined && sourceNode && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-600/40 mt-3"
                    >
                      <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>Visual Connection Preview</span>
                      </div>

                      {/* Animated Connection Arrow Diagram */}
                      <div className="bg-white dark:bg-[#070B19] p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between font-mono shadow-xs">
                        <div className="text-center min-w-[70px]">
                          <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                            Node {sourceNode.data}
                          </span>
                          <span className="block text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                            Addr: {sourceNode.address}
                          </span>
                        </div>

                        <div className="flex-1 flex flex-col items-center px-2">
                          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 font-mono mb-0.5">
                            NEXT = {selectedNextAddr !== null ? selectedNextAddr : 'NULL'}
                          </span>
                          <div className="w-full flex items-center">
                            <div className="h-[2px] w-full bg-linear-to-r from-blue-500 to-emerald-500" />
                            <ArrowRight className="w-4 h-4 -ml-1 text-emerald-500 stroke-[2.5]" />
                          </div>
                        </div>

                        <div className="text-center min-w-[70px]">
                          <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                            {destNode ? `Node ${destNode.data}` : 'NULL'}
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            {destNode ? `Addr: ${destNode.address}` : 'End of List'}
                          </span>
                        </div>
                      </div>

                      {/* Clear Educational Explanation */}
                      <div className="text-[11px] text-emerald-950 dark:text-emerald-200 space-y-1 mt-2.5 bg-emerald-100/70 dark:bg-emerald-900/30 p-2.5 rounded-xl">
                        <div className="font-bold flex items-center gap-1 text-emerald-800 dark:text-emerald-300">
                          <span>✓ Ready to connect!</span>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          Node {sourceNode.data} NEXT →{' '}
                          <strong>{destNode ? `Node ${destNode.data}` : 'NULL'}</strong>
                        </div>
                        <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                          NEXT Address →{' '}
                          <strong className="text-[#2563EB] dark:text-blue-300">
                            {selectedNextAddr !== null ? selectedNextAddr : 'NULL'}
                          </strong>
                        </div>
                        <p className="italic text-slate-600 dark:text-slate-300 text-[10px] pt-0.5">
                          {destNode
                            ? `"${destNode.address} is the memory address of Node ${destNode.data}."`
                            : `"NULL indicates the terminal end of the linked list."`}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* STEP 2: ENTER ADDRESS MANUALLY (ADVANCED MODE) */}
              {changeNextMode === 'MANUAL' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Enter NEXT Address
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newNextInput}
                        onChange={(e) => handleManualInputChange(e.target.value)}
                        placeholder="e.g. 1002 or NULL"
                        autoFocus
                        className={`flex-1 px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 ${
                          manualError
                            ? 'border-rose-400 focus:ring-rose-500'
                            : 'border-slate-200 dark:border-blue-900/30 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => handleManualInputChange('NULL')}
                        className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
                      >
                        NULL
                      </button>
                    </div>
                  </div>

                  {/* Available Addresses Suggestions */}
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
                      Available Addresses:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {nodes.map((n) => {
                        const isSelf = n.address === targetNodeAddr;
                        return (
                          <button
                            key={n.address}
                            type="button"
                            disabled={isSelf}
                            onClick={() => handleManualInputChange(String(n.address))}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 ${
                              isSelf
                                ? 'opacity-40 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                                : 'bg-[#EFF6FF] dark:bg-blue-950/50 border border-[#BFDBFE] dark:border-blue-900/30 text-[#2563EB] dark:text-blue-300 hover:bg-[#DBEAFE] cursor-pointer'
                            }`}
                          >
                            <span>• Node {n.data} → {n.address}</span>
                            {isSelf && <span className="text-[9px]">(self)</span>}
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => handleManualInputChange('NULL')}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 cursor-pointer"
                      >
                        • NULL → End of List
                      </button>
                    </div>
                  </div>

                  {/* Helpful Tip */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0A1026] border border-slate-200 dark:border-blue-900/30 flex items-start gap-2 text-xs">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>💡 Tip:</strong> The NEXT pointer stores the <strong>ADDRESS</strong> of the next node.
                    </span>
                  </div>

                  {/* Wrong Address Error Warning */}
                  {manualError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">⚠ Address Error</span>
                        <span>{manualError}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-blue-900/20">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyNextConnection}
                  disabled={manualError !== null || selectedNextAddr === undefined}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                    manualError !== null || selectedNextAddr === undefined
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                      : 'bg-linear-to-r from-[#2563EB] to-[#6366F1] hover:from-[#1D4ED8] hover:to-[#4F46E5] text-white shadow-md shadow-blue-600/20 cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
                  }`}
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>
                    {selectedNextAddr !== undefined
                      ? `Connect NEXT (${selectedNextAddr !== null ? selectedNextAddr : 'NULL'})`
                      : 'Select a Node to Connect'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* SET HEAD FORM */}
          {modalType === 'SET_HEAD' && (
            <form onSubmit={handleSetHeadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  HEAD Memory Address
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Enter the memory address of the first node, or "NULL" if the list is empty.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={headInput}
                    onChange={(e) => setHeadInput(e.target.value)}
                    placeholder="e.g. 1001 or NULL"
                    autoFocus
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setHeadInput('NULL')}
                    className="px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                  >
                    NULL
                  </button>
                </div>
              </div>

              {/* Quick Node Addresses Pills */}
              {nodes.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block mb-1">
                    Pick Node Address:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.map((n) => (
                      <button
                        key={n.address}
                        type="button"
                        onClick={() => setHeadInput(String(n.address))}
                        className="px-2 py-1 rounded-lg bg-[#EFF6FF] dark:bg-blue-950/50 border border-[#BFDBFE] dark:border-blue-500/30 text-[11px] font-mono font-semibold text-[#2563EB] dark:text-blue-300 hover:bg-[#DBEAFE]"
                      >
                        {n.address} [Data: {n.data}]
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Set HEAD</span>
                </button>
              </div>
            </form>
          )}

          {/* SET TAIL FORM */}
          {modalType === 'SET_TAIL' && (
            <form onSubmit={handleSetTailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  TAIL Memory Address
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                  Enter the memory address of the last node (whose NEXT is NULL), or "NULL".
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tailInput}
                    onChange={(e) => setTailInput(e.target.value)}
                    placeholder="e.g. 1004 or NULL"
                    autoFocus
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-blue-900/30 bg-slate-50 dark:bg-[#070B19] text-slate-900 dark:text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setTailInput('NULL')}
                    className="px-3 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-500/30 text-xs font-mono font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100"
                  >
                    NULL
                  </button>
                </div>
              </div>

              {/* Quick Node Addresses Pills */}
              {nodes.length > 0 && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase font-bold block mb-1">
                    Pick Node Address:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.map((n) => (
                      <button
                        key={n.address}
                        type="button"
                        onClick={() => setTailInput(String(n.address))}
                        className="px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-500/30 text-[11px] font-mono font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                      >
                        {n.address} [Data: {n.data}]
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Set TAIL</span>
                </button>
              </div>
            </form>
          )}

          {/* DELETE NODE FORM */}
          {modalType === 'DELETE_NODE' && (
            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              {nodes.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Underflow Guard Triggered</span>
                  </div>
                  <p>Cannot delete a node from an empty linked list. HEAD is currently NULL.</p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Select Node to Free Memory:
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {nodes.map((n) => (
                      <button
                        key={n.address}
                        type="button"
                        onClick={() => setDeleteAddr(n.address)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          deleteAddr === n.address
                            ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-500/30'
                            : 'border-slate-200 dark:border-blue-900/30 bg-slate-50/50 dark:bg-[#070B19] text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block">ADDR: {n.address}</span>
                        <span className="text-xs font-bold">DATA: {n.data}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={nodes.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Free(Node)</span>
                </button>
              </div>
            </form>
          )}

          {/* 3-TIER HINT */}
          {modalType === 'HINT' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {activeTask.hints.map((hint, idx) => {
                  const isUnlocked = idx <= hintLevel;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/30 text-slate-800 dark:text-slate-200'
                          : 'bg-slate-50 dark:bg-[#070B19] border-dashed border-slate-200 dark:border-blue-900/20 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Tier {idx + 1}: {idx === 0 ? 'Core Concept' : idx === 1 ? 'Pointer & Memory Logic' : 'Exact Action Rule'}</span>
                        </span>
                        {isUnlocked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                      </div>
                      {isUnlocked ? (
                        <p className="text-xs font-medium leading-relaxed">{hint}</p>
                      ) : (
                        <p className="text-xs font-mono text-slate-400 dark:text-slate-600 italic">
                          Locked. Click "Next Hint Tier" below to reveal.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
                {hintLevel < 2 && (
                  <button
                    type="button"
                    onClick={onAdvanceHint}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-4 h-4" />
                    <span>Reveal Tier {hintLevel + 2} Hint</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
