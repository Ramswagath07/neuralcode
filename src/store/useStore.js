import { create } from 'zustand'

export const TOPICS = [
  'Arrays','Strings','Linked Lists','Trees','Graphs',
  'Dynamic Programming','Greedy','Backtracking','Heap',
  'Tries','Sliding Window','Binary Search','Recursion','Sorting',
]

export const COMPANIES = [
  { value:'', label:'No specific company' },
  { value:'FAANG', label:'FAANG (Meta/Google/Amazon)' },
  { value:'Microsoft', label:'Microsoft' },
  { value:'Apple', label:'Apple' },
  { value:'Netflix', label:'Netflix' },
  { value:'Uber', label:'Uber / Lyft' },
  { value:'Startup', label:'Startup-focused' },
]

const ACTIVITY = Array.from({ length: 105 }, (_, i) => ({
  day: i,
  count: Math.min(4, Math.floor(Math.pow(i / 105, 0.7) * 5 * (Math.random() * 0.9 + 0.1))),
}))

export const useStore = create((set, get) => ({
  /* ── User ── */
  user: {
    name: 'Arjun Kumar', initials: 'AK', avatar: null,
    xp: 2840, level: 14, streak: 12,
    solved: 247, accuracy: 78, rank: 7,
    joinDate: '2024-01-15',
  },

  /* ── Config ── */
  difficulty:      'medium',
  selectedTopics:  ['Dynamic Programming','Graphs'],
  company:         '',
  language:        'python',
  mode:            'practice',

  /* ── Problem ── */
  currentProblem:  null,
  isGenerating:    false,
  problemCount:    0,
  solvedToday:     3,

  /* ── Chat ── */
  chatHistory:    [],
  isChatLoading:  false,

  /* ── UI ── */
  activePanel:    'generate',
  theme:          'dark',
  toast:          null,
  toastQueue:     [],

  /* ── Analytics data ── */
  topicMastery: {
    'Arrays':80, 'Strings':75, 'Trees':68, 'Linked Lists':65,
    'Binary Search':62, 'Heap':52, 'Backtracking':45,
    'Sorting':70, 'Greedy':48, 'Graphs':38,
    'Dynamic Programming':25, 'Tries':20, 'Sliding Window':55,
  },
  difficultyStats: { easy:{ solved:134,total:150 }, medium:{ solved:95,total:200 }, hard:{ solved:18,total:120 } },
  weeklyActivity:  [4,2,6,8,3,9,5],
  activityData:    ACTIVITY,
  solvedHistory: [
    { id:1, title:'Two Sum',           difficulty:'easy',   topic:'Arrays',              result:'accepted', time:'8m',  xp:60  },
    { id:2, title:'LRU Cache',         difficulty:'medium', topic:'Linked Lists',         result:'attempted',time:'32m', xp:0   },
    { id:3, title:'Word Ladder',       difficulty:'hard',   topic:'Graphs',              result:'failed',   time:'45m', xp:0   },
    { id:4, title:'Merge Intervals',   difficulty:'medium', topic:'Arrays',              result:'accepted', time:'18m', xp:120 },
    { id:5, title:'Coin Change',       difficulty:'medium', topic:'Dynamic Programming', result:'accepted', time:'25m', xp:120 },
    { id:6, title:'Valid Parentheses', difficulty:'easy',   topic:'Strings',             result:'accepted', time:'5m',  xp:60  },
    { id:7, title:'Kth Largest',       difficulty:'medium', topic:'Heap',                result:'accepted', time:'20m', xp:120 },
  ],
  achievements: [
    { id:1,  icon:'🔥', name:'On Fire',       desc:'12-day streak',            unlocked:true  },
    { id:2,  icon:'⚡', name:'Speed Demon',   desc:'Solved in under 5 min',    unlocked:true  },
    { id:3,  icon:'💯', name:'Perfect Score', desc:'100% on first try × 10',   unlocked:true  },
    { id:4,  icon:'🏆', name:'DP Master',     desc:'Solve 50 DP problems',     unlocked:false },
    { id:5,  icon:'🌟', name:'Graph Wizard',  desc:'Complete all graph paths',  unlocked:false },
    { id:6,  icon:'🚀', name:'500 Club',      desc:'Solve 500 problems',        unlocked:false },
    { id:7,  icon:'🎯', name:'Sharpshooter',  desc:'10 perfect solutions',      unlocked:true  },
    { id:8,  icon:'🌙', name:'Night Owl',     desc:'Solved after midnight',     unlocked:false },
    { id:9,  icon:'📚', name:'Bookworm',      desc:'Read 50 solutions',         unlocked:false },
  ],
  leaderboard: [
    { rank:1, initials:'RX', name:'rahul_x',   location:'Bangalore', xp:6240, solved:445, streak:28, colors:['#F59E0B','#EF4444'] },
    { rank:2, initials:'SK', name:'sarah_k',   location:'Singapore', xp:4820, solved:312, streak:15, colors:['#6378FF','#A855F7'] },
    { rank:3, initials:'MJ', name:'mia_j',     location:'Toronto',   xp:3960, solved:289, streak:21, colors:['#10B981','#22D3EE'] },
    { rank:4, initials:'LP', name:'lee_p',     location:'Seoul',     xp:3540, solved:267, streak:9,  colors:['#F97316','#F59E0B'] },
    { rank:5, initials:'AM', name:'alex_m',    location:'Berlin',    xp:3210, solved:254, streak:5,  colors:['#A855F7','#22D3EE'] },
    { rank:6, initials:'PK', name:'priya_k',   location:'Mumbai',    xp:3010, solved:248, streak:17, colors:['#22D3EE','#10B981'] },
    { rank:7, initials:'AK', name:'you (AK)',  location:'Chennai',   xp:2840, solved:247, streak:12, colors:['#6378FF','#A855F7'], isMe:true },
    { rank:8, initials:'VN', name:'v_nair',    location:'Hyderabad', xp:2790, solved:231, streak:6,  colors:['#EF4444','#A855F7'] },
    { rank:9, initials:'JL', name:'jenny_l',   location:'NYC',       xp:2650, solved:220, streak:3,  colors:['#F59E0B','#10B981'] },
    { rank:10,initials:'TK', name:'tom_k',     location:'London',    xp:2520, solved:208, streak:8,  colors:['#6378FF','#22D3EE'] },
  ],

  /* ── Actions ── */
  setDifficulty:     (d) => set({ difficulty: d }),
  toggleTopic:       (t) => set((s) => ({
    selectedTopics: s.selectedTopics.includes(t)
      ? s.selectedTopics.filter(x => x !== t)
      : [...s.selectedTopics, t],
  })),
  setCompany:        (c) => set({ company: c }),
  setLanguage:       (l) => set({ language: l }),
  setMode:           (m) => set({ mode: m }),
  setActivePanel:    (p) => set({ activePanel: p }),
  setCurrentProblem: (p) => set({ currentProblem: p }),
  setIsGenerating:   (v) => set({ isGenerating: v }),
  incProblemCount:   ()  => set((s) => ({ problemCount: s.problemCount + 1 })),
  addChatMessage:    (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
  setChatLoading:    (v) => set({ isChatLoading: v }),
  addXP:             (n) => set((s) => ({ user: { ...s.user, xp: s.user.xp + n } })),
  toggleTheme:       ()  => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    return { theme: next }
  }),
  showToast: (icon, message, type = 'info') => {
    set({ toast: { icon, message, type, id: Date.now() } })
    setTimeout(() => set({ toast: null }), 3400)
  },
}))
