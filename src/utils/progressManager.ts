import { ActivityRecord, ModuleRecord, ModuleStatus, SLLActivityCategory, UserProgressState } from '../types/game';

const STORAGE_KEY_V3 = 'algolearn_sll_100_points_progress_v3';

export const TOTAL_POINTS_MAX = 100;
export const TOTAL_CONCEPTS = 15;
export const CATEGORY_MAX = {
  learn: 25,
  visualize: 15,
  game: 40,
  quiz: 20,
} as const;

export const LEARN_ACTIVITIES: Array<{
  id: string;
  theoryChapterId: string;
  title: string;
  points: number;
}> = [
  { id: 'learn_intro', theoryChapterId: 'theory-01', title: 'Introduction to SLL', points: 1 },
  { id: 'learn_operations', theoryChapterId: 'theory-02', title: 'Operations of SLL', points: 2 },
  { id: 'learn_insert_beginning', theoryChapterId: 'theory-03', title: 'Insert at Beginning', points: 2 },
  { id: 'learn_insert_end', theoryChapterId: 'theory-04', title: 'Insert at End', points: 2 },
  { id: 'learn_insert_position', theoryChapterId: 'theory-05', title: 'Insert at Position', points: 2 },
  { id: 'learn_delete_beginning', theoryChapterId: 'theory-06', title: 'Delete at Beginning', points: 2 },
  { id: 'learn_delete_end', theoryChapterId: 'theory-07', title: 'Delete at End', points: 2 },
  { id: 'learn_delete_position', theoryChapterId: 'theory-08', title: 'Delete at Position', points: 2 },
  { id: 'learn_searching', theoryChapterId: 'theory-09', title: 'Searching', points: 2 },
  { id: 'learn_display', theoryChapterId: 'theory-10', title: 'Display', points: 1 },
  { id: 'learn_complexities', theoryChapterId: 'theory-11', title: 'Time Complexities', points: 2 },
  { id: 'learn_advantages', theoryChapterId: 'theory-12', title: 'Advantages', points: 1 },
  { id: 'learn_disadvantages', theoryChapterId: 'theory-13', title: 'Disadvantages', points: 1 },
  { id: 'learn_applications', theoryChapterId: 'theory-14', title: 'Applications', points: 3 },
  { id: 'learn_mastery', theoryChapterId: 'theory-15', title: 'Learn Completion / Mastery', points: 2 },
];

export const VISUALIZE_ACTIVITIES: Array<{
  id: string;
  title: string;
  points: number;
  description: string;
}> = [
  { id: 'visualize_node', title: 'Node Visualization', points: 3, description: 'Node creation, DATA, NEXT, HEAD, NULL structure' },
  { id: 'visualize_linking', title: 'Linking Nodes', points: 3, description: 'Connecting nodes via sequential pointer references' },
  { id: 'visualize_traversal', title: 'Traversal Visualization', points: 3, description: 'Sequential linear traversal from HEAD to NULL' },
  { id: 'visualize_insertion', title: 'Insertion Visualization', points: 3, description: 'Insert at beginning, end, and specific position' },
  { id: 'visualize_deletion', title: 'Deletion Visualization', points: 3, description: 'Delete at beginning, end, and specific position' },
];

export const GAME_ACTIVITIES: Record<'insertion' | 'deletion' | 'traversal', {
  id: string;
  categoryName: 'insertion' | 'deletion' | 'traversal';
  title: string;
  baseScore: number;
}> = {
  insertion: { id: 'game_insertion', categoryName: 'insertion', title: 'Insertion Game', baseScore: 15 },
  deletion: { id: 'game_deletion', categoryName: 'deletion', title: 'Deletion Game', baseScore: 15 },
  traversal: { id: 'game_traversal', categoryName: 'traversal', title: 'Traversal Game', baseScore: 10 },
};

export interface GameTaskScoringState {
  taskId: string; // e.g. "game_insertion_create_node"
  internalId: string; // e.g. "L1_T1"
  category: 'insertion' | 'deletion' | 'traversal';
  title: string;
  baseScore: number;
  hintUsed: boolean;
  guideUsed: boolean;
  conceptUsed: boolean;
  hintPenalty: number; // 2 if hintUsed, else 0
  guidePenalty: number; // 3 if guideUsed, else 0
  finalScore: number; // Math.max(0, baseScore - hintPenalty - guidePenalty)
  completed: boolean;
  attempts?: number;
  completedAt?: number;
}

export const GAME_TASK_DEFINITIONS: Record<string, {
  taskId: string;
  internalId: string;
  category: 'insertion' | 'deletion' | 'traversal';
  title: string;
  baseScore: number;
}> = {
  game_insertion_create_node: {
    taskId: 'game_insertion_create_node',
    internalId: 'L1_T1',
    category: 'insertion',
    title: 'Create a Node',
    baseScore: 4,
  },
  game_insertion_beginning: {
    taskId: 'game_insertion_beginning',
    internalId: 'L1_T3',
    category: 'insertion',
    title: 'Insert at Beginning',
    baseScore: 4,
  },
  game_insertion_end: {
    taskId: 'game_insertion_end',
    internalId: 'L1_T4',
    category: 'insertion',
    title: 'Insert at End',
    baseScore: 4,
  },
  game_insertion_position: {
    taskId: 'game_insertion_position',
    internalId: 'L4_T1',
    category: 'insertion',
    title: 'Insert at Any Position',
    baseScore: 3,
  },
  game_deletion_beginning: {
    taskId: 'game_deletion_beginning',
    internalId: 'L2_T1',
    category: 'deletion',
    title: 'Delete at Beginning',
    baseScore: 5,
  },
  game_deletion_end: {
    taskId: 'game_deletion_end',
    internalId: 'L2_T2',
    category: 'deletion',
    title: 'Delete at End',
    baseScore: 5,
  },
  game_deletion_position: {
    taskId: 'game_deletion_position',
    internalId: 'L4_T2',
    category: 'deletion',
    title: 'Delete at Any Position',
    baseScore: 5,
  },
  game_traversal_print: {
    taskId: 'game_traversal_print',
    internalId: 'L3_T1',
    category: 'traversal',
    title: 'Traverse and Print',
    baseScore: 10,
  },
};

export const TASK_ID_ALIASES: Record<string, string> = {
  L1_T1: 'game_insertion_create_node',
  L1_T3: 'game_insertion_beginning',
  L1_T4: 'game_insertion_end',
  L4_T1: 'game_insertion_position',
  L2_T1: 'game_deletion_beginning',
  L2_T2: 'game_deletion_end',
  L4_T2: 'game_deletion_position',
  L3_T1: 'game_traversal_print',
};

export const GAME_TASK_LIST = Object.values(GAME_TASK_DEFINITIONS);

export function toCanonicalGameTaskId(id: string): string {
  if (GAME_TASK_DEFINITIONS[id]) return id;
  if (TASK_ID_ALIASES[id]) return TASK_ID_ALIASES[id];
  return id;
}

export function createDefaultGameTasks(): Record<string, GameTaskScoringState> {
  const result: Record<string, GameTaskScoringState> = {};
  for (const [key, def] of Object.entries(GAME_TASK_DEFINITIONS)) {
    result[key] = {
      taskId: def.taskId,
      internalId: def.internalId,
      category: def.category,
      title: def.title,
      baseScore: def.baseScore,
      hintUsed: false,
      guideUsed: false,
      conceptUsed: false,
      hintPenalty: 0,
      guidePenalty: 0,
      finalScore: 0,
      completed: false,
      attempts: 1,
    };
  }
  return result;
}

export interface CentralizedProgressState {
  version: number;
  totalPoints: number; // 0 - 100
  learnScore: number; // 0 - 25
  visualizeScore: number; // 0 - 15
  gameScore: number; // 0 - 40
  quizScore: number; // 0 - 20
  completedActivities: Record<string, ActivityRecord>;
  gameTasks: Record<string, GameTaskScoringState>;
  gameAssistance: Record<string, { hintUsed: boolean; guideUsed: boolean; attempts: number }>;
  hasCelebrated100Percent: boolean;
  lastActiveTimestamp: number;
  completedVideos?: string[];
  levelsCompleted?: number[];
  totalScore?: number;
  quizSubmitted?: boolean;
}

const INITIAL_CENTRAL_STATE: CentralizedProgressState = {
  version: 3,
  totalPoints: 0,
  learnScore: 0,
  visualizeScore: 0,
  gameScore: 0,
  quizScore: 0,
  completedActivities: {},
  gameTasks: createDefaultGameTasks(),
  gameAssistance: {},
  hasCelebrated100Percent: false,
  lastActiveTimestamp: Date.now(),
  completedVideos: [],
  levelsCompleted: [],
  totalScore: 0,
  quizSubmitted: false,
};

type ProgressListener = (state: CentralizedProgressState) => void;

class ProgressManager {
  private state: CentralizedProgressState;
  private listeners: Set<ProgressListener> = new Set();

  constructor() {
    this.state = this.loadState();
    this.recalculateScores();
    this.saveState();
  }

  private loadState(): CentralizedProgressState {
    if (typeof window === 'undefined') return INITIAL_CENTRAL_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_V3);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          const gameTasks = createDefaultGameTasks();
          if (parsed.gameTasks && typeof parsed.gameTasks === 'object') {
            for (const [k, v] of Object.entries(parsed.gameTasks)) {
              const canonical = toCanonicalGameTaskId(k);
              if (gameTasks[canonical] && v && typeof v === 'object') {
                const val = v as Partial<GameTaskScoringState>;
                gameTasks[canonical] = {
                  ...gameTasks[canonical],
                  ...val,
                  taskId: canonical,
                  baseScore: GAME_TASK_DEFINITIONS[canonical].baseScore,
                  internalId: GAME_TASK_DEFINITIONS[canonical].internalId,
                  category: GAME_TASK_DEFINITIONS[canonical].category,
                  title: GAME_TASK_DEFINITIONS[canonical].title,
                };
              }
            }
          }

          // Check completedActivities for legacy or task records
          const completedActivities: Record<string, ActivityRecord> = { ...(parsed.completedActivities || {}) };

          // Remove legacy bulk category activities if any exist (so they don't skew points)
          delete completedActivities['game_insertion'];
          delete completedActivities['game_deletion'];
          delete completedActivities['game_traversal'];

          // Sync gameTasks with completedActivities & enforce strict negative marking
          for (const [taskKey, taskDef] of Object.entries(GAME_TASK_DEFINITIONS)) {
            const canonical = taskKey;
            const internal = taskDef.internalId;
            const rec = completedActivities[canonical] || completedActivities[internal];
            if (rec && rec.category === 'game') {
              gameTasks[canonical].completed = true;
              gameTasks[canonical].hintUsed = Boolean(rec.metadata?.hintUsed ?? gameTasks[canonical].hintUsed);
              gameTasks[canonical].guideUsed = Boolean(rec.metadata?.guideUsed ?? gameTasks[canonical].guideUsed);
              gameTasks[canonical].conceptUsed = Boolean(rec.metadata?.conceptUsed ?? gameTasks[canonical].conceptUsed);
              gameTasks[canonical].hintPenalty = gameTasks[canonical].hintUsed ? 2 : 0;
              gameTasks[canonical].guidePenalty = gameTasks[canonical].guideUsed ? 3 : 0;
              gameTasks[canonical].finalScore = Math.max(
                0,
                taskDef.baseScore - gameTasks[canonical].hintPenalty - gameTasks[canonical].guidePenalty
              );
              completedActivities[canonical] = {
                id: canonical,
                category: 'game',
                pointsAwarded: gameTasks[canonical].finalScore,
                maxPoints: taskDef.baseScore,
                completedAt: rec.completedAt || Date.now(),
                metadata: {
                  ...rec.metadata,
                  taskId: canonical,
                  internalId: internal,
                  category: taskDef.category,
                  baseScore: taskDef.baseScore,
                  hintUsed: gameTasks[canonical].hintUsed,
                  guideUsed: gameTasks[canonical].guideUsed,
                  conceptUsed: gameTasks[canonical].conceptUsed,
                  hintPenalty: gameTasks[canonical].hintPenalty,
                  guidePenalty: gameTasks[canonical].guidePenalty,
                  finalScore: gameTasks[canonical].finalScore,
                  attempts: gameTasks[canonical].attempts || 1,
                },
              };
              if (internal !== canonical) {
                delete completedActivities[internal];
              }
            } else if (gameTasks[canonical].completed) {
              gameTasks[canonical].hintPenalty = gameTasks[canonical].hintUsed ? 2 : 0;
              gameTasks[canonical].guidePenalty = gameTasks[canonical].guideUsed ? 3 : 0;
              gameTasks[canonical].finalScore = Math.max(
                0,
                taskDef.baseScore - gameTasks[canonical].hintPenalty - gameTasks[canonical].guidePenalty
              );
              completedActivities[canonical] = {
                id: canonical,
                category: 'game',
                pointsAwarded: gameTasks[canonical].finalScore,
                maxPoints: taskDef.baseScore,
                completedAt: gameTasks[canonical].completedAt || Date.now(),
                metadata: {
                  taskId: canonical,
                  internalId: internal,
                  category: taskDef.category,
                  baseScore: taskDef.baseScore,
                  hintUsed: gameTasks[canonical].hintUsed,
                  guideUsed: gameTasks[canonical].guideUsed,
                  conceptUsed: gameTasks[canonical].conceptUsed,
                  hintPenalty: gameTasks[canonical].hintPenalty,
                  guidePenalty: gameTasks[canonical].guidePenalty,
                  finalScore: gameTasks[canonical].finalScore,
                  attempts: gameTasks[canonical].attempts || 1,
                },
              };
            }
          }

          const state: CentralizedProgressState = {
            ...INITIAL_CENTRAL_STATE,
            ...parsed,
            completedActivities,
            gameTasks,
            gameAssistance: parsed.gameAssistance || {},
          };

          return state;
        }
      }
      return INITIAL_CENTRAL_STATE;
    } catch {
      return INITIAL_CENTRAL_STATE;
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      this.state.lastActiveTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEY_V3, JSON.stringify(this.state));
      this.notifyListeners();
    } catch (e) {
      console.error('Error saving progress to localStorage', e);
    }
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.getCentralState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = this.getCentralState();
    this.listeners.forEach((fn) => {
      try {
        fn(copy);
      } catch (err) {
        console.error('Error in progress listener', err);
      }
    });
  }

  public getCentralState(): CentralizedProgressState {
    const raw = JSON.parse(JSON.stringify(this.state));
    const levelsDone: number[] = [];
    if (this.isTopicComplete('insertion')) levelsDone.push(1);
    if (this.isTopicComplete('deletion')) levelsDone.push(2);
    if (this.isTopicComplete('traversal')) levelsDone.push(3);

    return {
      ...raw,
      completedVideos: VISUALIZE_ACTIVITIES.filter((a) => this.isCompleted(a.id)).map((a) => a.id),
      levelsCompleted: levelsDone,
      totalScore: this.getTotalPoints(),
      quizSubmitted: this.isCompleted('quiz_single_linked_list'),
    };
  }

  public isTopicComplete(topic: 'insertion' | 'deletion' | 'traversal'): boolean {
    const topicTasks = Object.values(GAME_TASK_DEFINITIONS).filter((d) => d.category === topic);
    return topicTasks.every((d) => {
      const state = this.getGameTaskState(d.taskId);
      return state.completed || this.isCompleted(d.taskId) || this.isCompleted(d.internalId);
    });
  }

  // =========================================================================
  // CORE 100-POINT SCORING SYSTEM API
  // =========================================================================

  public getTotalPoints(): number {
    return Math.min(100, Math.max(0, this.state.totalPoints));
  }

  public getCategoryScore(category: SLLActivityCategory): number {
    switch (category) {
      case 'learn':
        return Math.min(CATEGORY_MAX.learn, Math.max(0, this.state.learnScore));
      case 'visualize':
        return Math.min(CATEGORY_MAX.visualize, Math.max(0, this.state.visualizeScore));
      case 'game':
        return Math.min(CATEGORY_MAX.game, Math.max(0, this.state.gameScore));
      case 'quiz':
        return Math.min(CATEGORY_MAX.quiz, Math.max(0, this.state.quizScore));
      default:
        return 0;
    }
  }

  public getCategoryMax(category: SLLActivityCategory): number {
    return CATEGORY_MAX[category] || 0;
  }

  public isCompleted(activityId: string): boolean {
    const canonical = toCanonicalGameTaskId(activityId);
    if (this.state.completedActivities && (this.state.completedActivities[activityId] || this.state.completedActivities[canonical])) {
      return true;
    }
    if (this.state.gameTasks && this.state.gameTasks[canonical]?.completed) {
      return true;
    }
    return false;
  }

  public getActivity(activityId: string): ActivityRecord | null {
    const canonical = toCanonicalGameTaskId(activityId);
    return (
      (this.state.completedActivities && (this.state.completedActivities[canonical] || this.state.completedActivities[activityId])) ||
      null
    );
  }

  /**
   * Recalculate total points & category scores from recorded activities
   */
  private recalculateScores() {
    let learn = 0;
    let visualize = 0;
    let game = 0;
    let quiz = 0;

    Object.values(this.state.completedActivities).forEach((rec) => {
      if (rec.category === 'learn') learn += rec.pointsAwarded;
      else if (rec.category === 'visualize') visualize += rec.pointsAwarded;
      else if (rec.category === 'game') game += rec.pointsAwarded;
      else if (rec.category === 'quiz') quiz += rec.pointsAwarded;
    });

    this.state.learnScore = Math.min(CATEGORY_MAX.learn, Math.max(0, learn));
    this.state.visualizeScore = Math.min(CATEGORY_MAX.visualize, Math.max(0, visualize));
    this.state.gameScore = Math.min(CATEGORY_MAX.game, Math.max(0, game));
    this.state.quizScore = Math.min(CATEGORY_MAX.quiz, Math.max(0, quiz));
    this.state.totalPoints = Math.min(
      100,
      Math.max(0, this.state.learnScore + this.state.visualizeScore + this.state.gameScore + this.state.quizScore)
    );
  }

  /**
   * Generic completion handler with duplicate points protection
   */
  public markCompleted(
    activityId: string,
    category: SLLActivityCategory,
    points: number,
    metadata?: ActivityRecord['metadata']
  ): boolean {
    // DUPLICATE PROTECTION: never award points twice for the same activity
    if (this.isCompleted(activityId)) {
      return false;
    }

    const maxAllowed = CATEGORY_MAX[category];
    const currentScore = this.getCategoryScore(category);
    const roomInCat = Math.max(0, maxAllowed - currentScore);
    const actualAward = Math.min(points, roomInCat);

    const record: ActivityRecord = {
      id: activityId,
      category,
      pointsAwarded: actualAward,
      maxPoints: points,
      completedAt: Date.now(),
      metadata,
    };

    this.state.completedActivities[activityId] = record;
    this.recalculateScores();
    this.saveState();
    return true;
  }

  /**
   * Complete a Learn section (1 to 15)
   */
  public completeLearnSection(sectionNumber: number): { newlyCompleted: boolean; pointsAwarded: number } {
    const item = LEARN_ACTIVITIES[sectionNumber - 1];
    if (!item) return { newlyCompleted: false, pointsAwarded: 0 };

    if (this.isCompleted(item.id)) {
      return { newlyCompleted: false, pointsAwarded: 0 };
    }

    const awarded = this.markCompleted(item.id, 'learn', item.points, { sectionNumber, title: item.title });
    return { newlyCompleted: awarded, pointsAwarded: awarded ? item.points : 0 };
  }

  public completeLearnByChapterId(chapterId: string): { newlyCompleted: boolean; pointsAwarded: number } {
    const item = LEARN_ACTIVITIES.find((l) => l.theoryChapterId === chapterId);
    if (!item) return { newlyCompleted: false, pointsAwarded: 0 };
    return this.completeLearnSection(LEARN_ACTIVITIES.indexOf(item) + 1);
  }

  /**
   * Complete a Visualize activity (1 to 5)
   */
  public completeVisualizeActivity(activityId: string): { newlyCompleted: boolean; pointsAwarded: number } {
    const act = VISUALIZE_ACTIVITIES.find((v) => v.id === activityId);
    if (!act) return { newlyCompleted: false, pointsAwarded: 0 };

    if (this.isCompleted(act.id)) {
      return { newlyCompleted: false, pointsAwarded: 0 };
    }

    const awarded = this.markCompleted(act.id, 'visualize', act.points, { title: act.title });
    return { newlyCompleted: awarded, pointsAwarded: awarded ? act.points : 0 };
  }

  // =========================================================================
  // GAME ASSISTANCE & PENALTY ENGINE
  // =========================================================================

  public getGameTaskState(id: string): GameTaskScoringState {
    const canonical = toCanonicalGameTaskId(id);
    if (this.state.gameTasks && this.state.gameTasks[canonical]) {
      return this.state.gameTasks[canonical];
    }
    const def = GAME_TASK_DEFINITIONS[canonical];
    if (def) {
      const task: GameTaskScoringState = {
        taskId: def.taskId,
        internalId: def.internalId,
        category: def.category,
        title: def.title,
        baseScore: def.baseScore,
        hintUsed: false,
        guideUsed: false,
        conceptUsed: false,
        hintPenalty: 0,
        guidePenalty: 0,
        finalScore: 0,
        completed: false,
        attempts: 1,
      };
      if (!this.state.gameTasks) this.state.gameTasks = {};
      this.state.gameTasks[canonical] = task;
      return task;
    }
    return {
      taskId: canonical,
      internalId: canonical,
      category: 'insertion',
      title: canonical,
      baseScore: 4,
      hintUsed: false,
      guideUsed: false,
      conceptUsed: false,
      hintPenalty: 0,
      guidePenalty: 0,
      finalScore: 0,
      completed: false,
      attempts: 1,
    };
  }

  public recordGameTaskAssistance(id: string, type: 'hint' | 'guide' | 'concept'): void {
    const canonical = toCanonicalGameTaskId(id);
    const task = this.getGameTaskState(canonical);

    // Apply penalties only once per assistance type (no multiple deductions)
    if (type === 'hint') {
      task.hintUsed = true;
      task.hintPenalty = 2;
    } else if (type === 'guide') {
      task.guideUsed = true;
      task.guidePenalty = 3;
    } else if (type === 'concept') {
      task.conceptUsed = true;
      // CONCEPT HAS NO PENALTY (0 XP)
    }

    // Maintain backwards compatibility in gameAssistance map
    if (!this.state.gameAssistance[canonical]) {
      this.state.gameAssistance[canonical] = { hintUsed: false, guideUsed: false, attempts: 1 };
    }
    if (!this.state.gameAssistance[task.internalId]) {
      this.state.gameAssistance[task.internalId] = { hintUsed: false, guideUsed: false, attempts: 1 };
    }
    if (type === 'hint') {
      this.state.gameAssistance[canonical].hintUsed = true;
      this.state.gameAssistance[task.internalId].hintUsed = true;
    } else if (type === 'guide') {
      this.state.gameAssistance[canonical].guideUsed = true;
      this.state.gameAssistance[task.internalId].guideUsed = true;
    }

    // CRITICAL: DO NOT subtract from global score when help is clicked!
    // Simply persist the task's assistance flag so it is applied on completion.
    this.saveState();
  }

  public recordGameAssistance(
    keyOrTaskId: string,
    type: 'hint' | 'guide' | 'concept'
  ): void {
    this.recordGameTaskAssistance(keyOrTaskId, type);
  }

  public incrementGameAttempt(keyOrTaskId: string): number {
    const canonical = toCanonicalGameTaskId(keyOrTaskId);
    const task = this.getGameTaskState(canonical);
    task.attempts = (task.attempts || 1) + 1;

    if (!this.state.gameAssistance[keyOrTaskId]) {
      this.state.gameAssistance[keyOrTaskId] = { hintUsed: false, guideUsed: false, attempts: 1 };
    } else {
      this.state.gameAssistance[keyOrTaskId].attempts += 1;
    }
    this.saveState();
    return task.attempts;
  }

  public getGameAssistance(keyOrTaskId: string) {
    const canonical = toCanonicalGameTaskId(keyOrTaskId);
    const task = this.getGameTaskState(canonical);
    return {
      hintUsed: task.hintUsed,
      guideUsed: task.guideUsed,
      attempts: task.attempts || 1,
    };
  }

  /**
   * Calculate penalty formula strictly:
   * finalScore = Math.max(0, baseScore - (guideUsed ? 3 : 0) - (hintUsed ? 2 : 0))
   */
  public calculateGameScore(
    category: 'insertion' | 'deletion' | 'traversal',
    taskId?: string
  ): {
    baseScore: number;
    hintUsed: boolean;
    guideUsed: boolean;
    hintPenalty: number;
    guidePenalty: number;
    totalPenalty: number;
    finalScore: number;
  } {
    if (taskId) {
      const canonical = toCanonicalGameTaskId(taskId);
      const task = this.getGameTaskState(canonical);
      const hintPenalty = task.hintUsed ? 2 : 0;
      const guidePenalty = task.guideUsed ? 3 : 0;
      const totalPenalty = hintPenalty + guidePenalty;
      const finalScore = Math.max(0, task.baseScore - totalPenalty);
      return {
        baseScore: task.baseScore,
        hintUsed: task.hintUsed,
        guideUsed: task.guideUsed,
        hintPenalty,
        guidePenalty,
        totalPenalty,
        finalScore,
      };
    }

    const baseScore = category === 'traversal' ? 10 : 15;
    return {
      baseScore,
      hintUsed: false,
      guideUsed: false,
      hintPenalty: 0,
      guidePenalty: 0,
      totalPenalty: 0,
      finalScore: baseScore,
    };
  }

  /**
   * Complete a specific Game Task and calculate negative marking accurately.
   * Duplicate protection: Replays award 0 XP.
   */
  public completeGameTask(taskId: string): {
    newlyCompleted: boolean;
    task: GameTaskScoringState;
    baseScore: number;
    hintPenalty: number;
    guidePenalty: number;
    totalPenalty: number;
    finalScore: number;
    alreadyCompleted: boolean;
  } {
    const canonical = toCanonicalGameTaskId(taskId);
    const task = this.getGameTaskState(canonical);

    // DUPLICATE PROTECTION:
    // If task was already completed, return 0 additional points
    if (task.completed === true || this.isCompleted(canonical)) {
      const hintPenalty = task.hintUsed ? 2 : 0;
      const guidePenalty = task.guideUsed ? 3 : 0;
      return {
        newlyCompleted: false,
        task,
        baseScore: task.baseScore,
        hintPenalty,
        guidePenalty,
        totalPenalty: hintPenalty + guidePenalty,
        finalScore: 0,
        alreadyCompleted: true,
      };
    }

    const hintPenalty = task.hintUsed ? 2 : 0;
    const guidePenalty = task.guideUsed ? 3 : 0;
    const totalPenalty = hintPenalty + guidePenalty;
    const finalScore = Math.max(0, task.baseScore - totalPenalty);

    task.hintPenalty = hintPenalty;
    task.guidePenalty = guidePenalty;
    task.finalScore = finalScore;
    task.completed = true;
    task.completedAt = Date.now();

    // DUPLICATE PROTECTION: Only award finalScore ONCE in completedActivities
    const maxAllowed = CATEGORY_MAX.game;
    const currentScore = this.getCategoryScore('game');
    const roomInCat = Math.max(0, maxAllowed - currentScore);
    const actualAward = Math.min(finalScore, roomInCat);

    const record: ActivityRecord = {
      id: canonical,
      category: 'game',
      pointsAwarded: actualAward,
      maxPoints: task.baseScore,
      completedAt: Date.now(),
      metadata: {
        taskId: canonical,
        internalId: task.internalId,
        category: task.category,
        baseScore: task.baseScore,
        hintUsed: task.hintUsed,
        guideUsed: task.guideUsed,
        conceptUsed: task.conceptUsed,
        hintPenalty,
        guidePenalty,
        finalScore: actualAward,
        attempts: task.attempts || 1,
      },
    };

    this.state.completedActivities[canonical] = record;
    this.state.gameTasks[canonical] = task;
    this.recalculateScores();
    this.saveState();

    return {
      newlyCompleted: true,
      task,
      baseScore: task.baseScore,
      hintPenalty,
      guidePenalty,
      totalPenalty,
      finalScore: actualAward,
      alreadyCompleted: false,
    };
  }

  /**
   * Awards game category / task points with duplicate protection
   */
  public completeGameCategory(
    category: 'insertion' | 'deletion' | 'traversal',
    taskId?: string
  ): {
    newlyCompleted: boolean;
    baseScore: number;
    hintPenalty: number;
    guidePenalty: number;
    totalPenalty: number;
    finalScore: number;
    alreadyCompleted: boolean;
  } {
    if (taskId) {
      return this.completeGameTask(taskId);
    }

    const base = category === 'traversal' ? 10 : 15;
    return {
      newlyCompleted: false,
      baseScore: base,
      hintPenalty: 0,
      guidePenalty: 0,
      totalPenalty: 0,
      finalScore: 0,
      alreadyCompleted: false,
    };
  }

  public getGameTopicEarnedScore(topic: 'insertion' | 'deletion' | 'traversal'): number {
    let sum = 0;
    for (const def of Object.values(GAME_TASK_DEFINITIONS)) {
      if (def.category === topic) {
        const task = this.getGameTaskState(def.taskId);
        if (task.completed) {
          sum += task.finalScore;
        }
      }
    }
    return sum;
  }

  // =========================================================================
  // QUIZ ENGINE (20 POINTS MAX)
  // =========================================================================

  public recordQuizScore(
    correctCount: number,
    totalQuestions: number,
    studentAnswers?: any
  ): {
    newlyCompleted: boolean;
    quizScore: number;
    pointsAwarded: number;
  } {
    if (totalQuestions <= 0) return { newlyCompleted: false, quizScore: 0, pointsAwarded: 0 };

    const calculatedPoints = Math.min(20, Math.round((correctCount / totalQuestions) * 20));
    const activityId = 'quiz_single_linked_list';

    // If already completed previously, update only if higher or keep recorded
    const existing = this.getActivity(activityId);
    if (existing) {
      if (calculatedPoints > existing.pointsAwarded) {
        const diff = calculatedPoints - existing.pointsAwarded;
        existing.pointsAwarded = calculatedPoints;
        existing.metadata = { correctCount, totalQuestions, studentAnswers, percentage: Math.round((correctCount / totalQuestions) * 100) };
        this.recalculateScores();
        this.saveState();
        return { newlyCompleted: false, quizScore: calculatedPoints, pointsAwarded: diff };
      }
      return { newlyCompleted: false, quizScore: existing.pointsAwarded, pointsAwarded: 0 };
    }

    const awarded = this.markCompleted(activityId, 'quiz', calculatedPoints, {
      correctCount,
      totalQuestions,
      studentAnswers,
      percentage: Math.round((correctCount / totalQuestions) * 100),
    });

    return {
      newlyCompleted: awarded,
      quizScore: calculatedPoints,
      pointsAwarded: awarded ? calculatedPoints : 0,
    };
  }

  public recordQuizCompletion(
    studentAnswers: any,
    correctCount: number,
    totalQuestions: number
  ) {
    return this.recordQuizScore(correctCount, totalQuestions, studentAnswers);
  }

  public resetQuizAttempt() {
    delete this.state.completedActivities['quiz_single_linked_list'];
    this.recalculateScores();
    this.saveState();
  }

  // =========================================================================
  // MASTERY & PROGRESS METRICS
  // =========================================================================

  public getProgressPercentage(): number {
    return Math.min(100, Math.max(0, Math.round((this.getTotalPoints() / 100) * 100)));
  }

  public getMasteryLevel(score?: number): {
    tier: 'Beginner' | 'Learner' | 'Intermediate' | 'Advanced' | 'Master';
    label: string;
    badge: string;
    isMaster: boolean;
  } {
    const pts = score !== undefined ? score : this.getTotalPoints();
    if (pts >= 100) {
      return { tier: 'Master', label: '🎉 MASTER', badge: '100 / 100', isMaster: true };
    }
    if (pts >= 75) {
      return { tier: 'Advanced', label: 'Advanced', badge: '75–99 Points', isMaster: false };
    }
    if (pts >= 50) {
      return { tier: 'Intermediate', label: 'Intermediate', badge: '50–74 Points', isMaster: false };
    }
    if (pts >= 25) {
      return { tier: 'Learner', label: 'Learner', badge: '25–49 Points', isMaster: false };
    }
    return { tier: 'Beginner', label: 'Beginner', badge: '0–24 Points', isMaster: false };
  }

  public getCompletedActivitiesCount(): number {
    return Object.keys(this.state.completedActivities).length;
  }

  public getTotalActivitiesCount(): number {
    // 15 Learn + 5 Visualize + 8 Game Tasks + 1 Quiz = 29
    return 29;
  }

  public setCelebrationAcknowledged() {
    this.state.hasCelebrated100Percent = true;
    this.saveState();
  }

  public resetProgress() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_V3);
        localStorage.removeItem('sll_quiz_answers_v1');
        localStorage.removeItem('sll_quiz_submitted_v1');
        localStorage.removeItem('sll_completed_tasks');
      } catch {
        // Ignore
      }
    }

    this.state = {
      version: 3,
      totalPoints: 0,
      learnScore: 0,
      visualizeScore: 0,
      gameScore: 0,
      quizScore: 0,
      completedActivities: {},
      gameTasks: createDefaultGameTasks(),
      gameAssistance: {},
      hasCelebrated100Percent: false,
      lastActiveTimestamp: Date.now(),
    };
    this.saveState();
  }

  // =========================================================================
  // BACKWARD COMPATIBILITY ADAPTERS
  // =========================================================================

  public getState(): UserProgressState {
    const completedTheory = LEARN_ACTIVITIES.filter((a) => this.isCompleted(a.id)).map((a) => a.theoryChapterId);
    const quizRec = this.getActivity('quiz_single_linked_list');

    return {
      version: 2,
      modules: {},
      moduleProgress: {},
      completedTheoryChapters: completedTheory,
      currentTheoryChapterId: 'theory-01',
      levelCompletedKeys: {},
      levelsCompleted: [
        this.isCompleted('game_insertion') ? 1 : 0,
        this.isCompleted('game_deletion') ? 2 : 0,
        this.isCompleted('game_traversal') ? 3 : 0,
      ].filter((x) => x > 0),
      levelsMastered: [],
      quizScores: quizRec?.metadata?.studentAnswers || {},
      quizSubmitted: Boolean(quizRec),
      quizFinalScore: quizRec?.pointsAwarded ? Math.round((quizRec.pointsAwarded / 20) * 100) : 0,
      sandboxOperationsCount: 0,
      totalScore: this.getTotalPoints(),
      streak: 0,
      currentActiveModuleId: 'fn-01-basics',
      lastActiveTimestamp: this.state.lastActiveTimestamp,
      hasCelebrated100Percent: this.state.hasCelebrated100Percent,
      completedVideos: [
        this.isCompleted('visualize_node') ? 'lesson-01' : '',
        this.isCompleted('visualize_traversal') ? 'lesson-02' : '',
      ].filter(Boolean),
    };
  }

  public getStats() {
    const total = this.getTotalActivitiesCount();
    const completed = this.getCompletedActivitiesCount();
    const percentage = this.getProgressPercentage();
    const isAllComplete = percentage === 100;
    const mastery = this.getMasteryLevel();

    return {
      total,
      completed,
      mastered: isAllComplete ? 1 : 0,
      percentage,
      isAllComplete,
      masteryLevel: mastery.label,
      theory: {
        total: 15,
        completed: LEARN_ACTIVITIES.filter((a) => this.isCompleted(a.id)).length,
        percentage: Math.round((this.getCategoryScore('learn') / 25) * 100),
      },
      video: {
        total: 5,
        completed: VISUALIZE_ACTIVITIES.filter((a) => this.isCompleted(a.id)).length,
        percentage: Math.round((this.getCategoryScore('visualize') / 15) * 100),
      },
      game: {
        total: 3,
        completed: ['game_insertion', 'game_deletion', 'game_traversal'].filter((id) => this.isCompleted(id)).length,
        percentage: Math.round((this.getCategoryScore('game') / 40) * 100),
      },
      quiz: {
        total: 1,
        completed: this.isCompleted('quiz_single_linked_list') ? 1 : 0,
        isSubmitted: this.isCompleted('quiz_single_linked_list'),
        finalScore: this.getCategoryScore('quiz'),
        percentage: Math.round((this.getCategoryScore('quiz') / 20) * 100),
      },
      nextModule: this.getModules().find((m) => m.status !== 'COMPLETED') || null,
    };
  }

  public getTheoryStats() {
    const completedList = LEARN_ACTIVITIES.filter((a) => this.isCompleted(a.id)).map((a) => a.theoryChapterId);
    return {
      total: 15,
      completed: completedList.length,
      percentage: Math.round((this.getCategoryScore('learn') / 25) * 100),
      isComplete: completedList.length >= 15,
      completedIds: completedList,
      currentChapterId: 'theory-01',
    };
  }

  public getVideoStats() {
    const completedIds = VISUALIZE_ACTIVITIES.filter((a) => this.isCompleted(a.id)).map((a) => a.id);
    return {
      total: 5,
      completed: completedIds.length,
      percentage: Math.round((this.getCategoryScore('visualize') / 15) * 100),
      isComplete: completedIds.length >= 5,
      completedVideos: completedIds,
    };
  }

  public getGameStats() {
    const ids = ['game_insertion', 'game_deletion', 'game_traversal'].filter((id) => this.isCompleted(id));
    return {
      total: 3,
      completed: ids.length,
      percentage: Math.round((this.getCategoryScore('game') / 40) * 100),
      isComplete: ids.length >= 3,
      completedLevels: ids,
    };
  }

  public getQuizStats() {
    const isSubmitted = this.isCompleted('quiz_single_linked_list');
    return {
      total: 1,
      completed: isSubmitted ? 1 : 0,
      percentage: isSubmitted ? 100 : 0,
      isSubmitted,
      finalScore: this.getCategoryScore('quiz'),
      isComplete: isSubmitted,
    };
  }

  public isTheoryChapterCompleted(chapterId: string): boolean {
    const act = LEARN_ACTIVITIES.find((l) => l.theoryChapterId === chapterId);
    return act ? this.isCompleted(act.id) : false;
  }

  public completeTheoryChapter(chapterId: string): boolean {
    const result = this.completeLearnByChapterId(chapterId);
    return result.newlyCompleted;
  }

  public isVideoCompleted(videoId: string): boolean {
    return this.isCompleted(videoId);
  }

  public completeVideo(videoId: string): boolean {
    const result = this.completeVisualizeActivity(videoId);
    return result.newlyCompleted;
  }

  public markLevelCompleted(levelId: number, _score: number = 100, _isPerfect: boolean = false) {
    if (levelId === 1) this.completeGameCategory('insertion');
    else if (levelId === 2) this.completeGameCategory('deletion');
    else if (levelId === 3) this.completeGameCategory('traversal');
  }

  public checkAndCompleteCertification() {
    if (this.getTotalPoints() === 100 && !this.state.hasCelebrated100Percent) {
      this.saveState();
    }
  }

  public addScore(points: number) {
    // If external callers call addScore, do not artificially inflate beyond 100
    // Real points must be tied to activities
    if (points > 0 && this.state.totalPoints < 100) {
      this.state.totalPoints = Math.min(100, this.state.totalPoints + points);
      this.saveState();
    }
  }

  public startModule(_moduleId: string) {}
  public updateModuleProgress(_moduleId: string, _percent: number) {}
  public completeModule(_moduleId: string) {}
  public recordSandboxOp() {}
  public setCurrentTheoryChapter(_id: string) {}
  public getModules(): ModuleRecord[] {
    return LEARN_ACTIVITIES.map((item, idx) => {
      const isDone = this.isCompleted(item.id);
      return {
        id: item.id,
        number: String(idx + 1).padStart(2, '0'),
        code: `SLL-${String(idx + 1).padStart(2, '0')}`,
        title: item.title,
        category: 'FOUNDATION',
        description: `Learn ${item.title} and earn ${item.points} pts.`,
        status: (isDone ? 'COMPLETED' : 'NOT_STARTED') as ModuleStatus,
        progressPercent: isDone ? 100 : 0,
        criteriaDescription: `Complete learning activity to earn ${item.points} point(s).`,
        targetTab: 'THEORY',
        targetChapterId: item.theoryChapterId,
      };
    });
  }
}

export const normalizeTheoryChapterId = (id: string): string => {
  if (!id) return 'theory-01';
  if (id.startsWith('theory-')) return id;
  const match = LEARN_ACTIVITIES.find((a) => a.id === id);
  return match ? match.theoryChapterId : id;
};

export const progressManager = new ProgressManager();
