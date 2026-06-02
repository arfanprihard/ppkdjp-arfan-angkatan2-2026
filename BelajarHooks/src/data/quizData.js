// ============================================
// React Hooks Academy — Quiz Data
// ============================================

export const modulesData = [
  // ─── MODULE 1: useState ───
  {
    id: 'useState',
    title: 'useState',
    icon: '🔄',
    color: '#6C5CE7',
    description: 'Mengelola state kompleks, lazy initialization, dan updater function',
    theory: `**useState** adalah hook paling dasar di React untuk mengelola state di functional component.

**Konsep Level Menengah:**

1. **Updater Function** — Gunakan callback form saat state baru bergantung pada state sebelumnya:
\`\`\`jsx
setCount(prev => prev + 1) // ✅ Benar
setCount(count + 1)         // ⚠️ Bisa stale
\`\`\`

2. **Lazy Initialization** — Gunakan function sebagai initial value untuk komputasi berat:
\`\`\`jsx
const [data, setData] = useState(() => {
  return expensiveComputation();
});
\`\`\`

3. **Object/Array State** — Selalu buat copy baru (immutability):
\`\`\`jsx
setUser(prev => ({ ...prev, name: 'Budi' }));
setItems(prev => [...prev, newItem]);
\`\`\`

4. **Batching** — React 18+ otomatis batch multiple setState calls.`,
    quiz: [
      {
        id: 'us1',
        type: 'multiple-choice',
        question: 'Apa output dari kode berikut?\n```jsx\nconst [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n```\nSetelah 1x klik, berapa nilai count?',
        options: ['3', '1', '0', 'Error'],
        correct: 1,
        explanation: 'Karena menggunakan `count` langsung (bukan updater function), semua setCount menggunakan nilai `count` yang sama (0). Jadi hasilnya 0+1 = 1.'
      },
      {
        id: 'us2',
        type: 'multiple-choice',
        question: 'Apa output jika menggunakan updater function?\n```jsx\nconst [count, setCount] = useState(0);\n\nfunction handleClick() {\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n  setCount(prev => prev + 1);\n}\n```\nSetelah 1x klik, berapa nilai count?',
        options: ['3', '1', '0', 'Error'],
        correct: 0,
        explanation: 'Updater function menerima state terbaru dari update sebelumnya. Jadi: 0→1→2→3. Hasilnya 3.'
      },
      {
        id: 'us3',
        type: 'true-false',
        question: 'Lazy initialization `useState(() => expensiveCalc())` hanya dijalankan sekali saat komponen pertama kali render.',
        correct: true,
        explanation: 'Benar! Function yang diberikan ke useState sebagai initial value hanya dipanggil saat mount pertama kali, bukan setiap re-render.'
      },
      {
        id: 'us4',
        type: 'bug-hunt',
        question: 'Temukan bug di kode berikut:\n```jsx\nconst [user, setUser] = useState({ name: "Andi", age: 20 });\n\nfunction updateName() {\n  user.name = "Budi";\n  setUser(user);\n}\n```',
        options: [
          'Mutasi langsung pada object state, harus buat object baru',
          'setUser tidak menerima object',
          'useState tidak bisa menyimpan object',
          'Tidak ada bug'
        ],
        correct: 0,
        explanation: 'Object dimutasi langsung dan reference-nya sama, React tidak detect perubahan. Seharusnya: `setUser(prev => ({...prev, name: "Budi"}))`'
      },
      {
        id: 'us5',
        type: 'code-completion',
        question: 'Lengkapi kode untuk menambahkan item ke array state:\n```jsx\nconst [items, setItems] = useState(["apel", "jeruk"]);\n\nfunction addItem(newItem) {\n  setItems(_____);\n}\n```',
        options: [
          'prev => [...prev, newItem]',
          'items.push(newItem)',
          '[newItem]',
          'prev => prev.push(newItem)'
        ],
        correct: 0,
        explanation: 'Gunakan spread operator untuk membuat array baru: `prev => [...prev, newItem]`. Jangan gunakan push() karena itu mutasi langsung.'
      },
      {
        id: 'us6',
        type: 'multiple-choice',
        question: 'Kapan sebaiknya menggunakan lazy initialization di useState?',
        options: [
          'Saat initial value membutuhkan komputasi berat (misalnya membaca dari localStorage)',
          'Setiap kali menggunakan useState',
          'Hanya saat state berupa object',
          'Saat komponen memiliki banyak props'
        ],
        correct: 0,
        explanation: 'Lazy initialization berguna saat komputasi initial value mahal, seperti parsing JSON dari localStorage. Ini mencegah komputasi ulang setiap re-render.'
      }
    ]
  },

  // ─── MODULE 2: useEffect ───
  {
    id: 'useEffect',
    title: 'useEffect',
    icon: '⚡',
    color: '#00B894',
    description: 'Cleanup, dependencies array, dan menghindari race conditions',
    theory: `**useEffect** digunakan untuk side effects: fetching data, subscriptions, timers, dan manipulasi DOM.

**Konsep Level Menengah:**

1. **Cleanup Function** — Wajib untuk mencegah memory leak:
\`\`\`jsx
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer); // cleanup!
}, []);
\`\`\`

2. **Dependencies Array** — Mengontrol kapan effect dijalankan:
\`\`\`jsx
useEffect(() => {}, [])     // mount only
useEffect(() => {}, [dep])  // saat dep berubah
useEffect(() => {})         // setiap render ⚠️
\`\`\`

3. **Race Condition** — Gunakan cleanup flag:
\`\`\`jsx
useEffect(() => {
  let cancelled = false;
  fetchData().then(data => {
    if (!cancelled) setData(data);
  });
  return () => { cancelled = true; };
}, [id]);
\`\`\`

4. **Strict Mode** — Di development, effect dipanggil 2x untuk mendeteksi bug.`,
    quiz: [
      {
        id: 'ue1',
        type: 'multiple-choice',
        question: 'Kapan cleanup function di useEffect dipanggil?',
        options: [
          'Sebelum effect berikutnya dijalankan dan saat komponen unmount',
          'Hanya saat komponen unmount',
          'Setiap kali render',
          'Hanya saat dependencies berubah'
        ],
        correct: 0,
        explanation: 'Cleanup dipanggil sebelum effect berikutnya dijalankan (untuk membersihkan effect sebelumnya) DAN saat komponen unmount.'
      },
      {
        id: 'ue2',
        type: 'bug-hunt',
        question: 'Temukan masalah di kode ini:\n```jsx\nuseEffect(() => {\n  const ws = new WebSocket("ws://api.example.com");\n  ws.onmessage = (msg) => setMessages(prev => [...prev, msg]);\n}, []);\n```',
        options: [
          'Tidak ada cleanup — WebSocket tidak ditutup saat unmount (memory leak)',
          'Tidak boleh pakai WebSocket di useEffect',
          'Dependencies array salah',
          'Tidak ada masalah'
        ],
        correct: 0,
        explanation: 'WebSocket harus ditutup saat cleanup: `return () => ws.close();` untuk mencegah memory leak.'
      },
      {
        id: 'ue3',
        type: 'multiple-choice',
        question: '```jsx\nconst [count, setCount] = useState(0);\n\nuseEffect(() => {\n  console.log("Effect!");\n});\n```\nKapan "Effect!" ditampilkan?',
        options: [
          'Setiap kali komponen re-render',
          'Hanya saat mount pertama',
          'Tidak pernah',
          'Hanya saat count berubah'
        ],
        correct: 0,
        explanation: 'Tanpa dependencies array, useEffect berjalan setiap kali komponen render (mount + setiap update).'
      },
      {
        id: 'ue4',
        type: 'true-false',
        question: 'Di React Strict Mode (development), useEffect dengan `[]` dependency array akan dipanggil 2 kali saat mount.',
        correct: true,
        explanation: 'Benar! React Strict Mode sengaja memanggil effect 2 kali di development untuk membantu mendeteksi cleanup yang hilang.'
      },
      {
        id: 'ue5',
        type: 'code-completion',
        question: 'Lengkapi kode untuk mencegah race condition pada data fetching:\n```jsx\nuseEffect(() => {\n  let _____ = false;\n  \n  fetch(`/api/user/${id}`)\n    .then(res => res.json())\n    .then(data => {\n      if (!_____) setUser(data);\n    });\n  \n  return () => { _____ = true; };\n}, [id]);\n```',
        options: [
          'cancelled',
          'loading',
          'mounted',
          'fetched'
        ],
        correct: 0,
        explanation: 'Variabel `cancelled` digunakan sebagai flag. Saat effect dibersihkan (user pindah halaman), flag menjadi true sehingga state tidak di-update dengan data yang sudah tidak relevan.'
      },
      {
        id: 'ue6',
        type: 'multiple-choice',
        question: 'Mengapa kode ini menyebabkan infinite loop?\n```jsx\nconst [data, setData] = useState([]);\n\nuseEffect(() => {\n  fetch("/api/data")\n    .then(res => res.json())\n    .then(result => setData(result));\n}, [data]);\n```',
        options: [
          'Karena `data` ada di dependencies — setiap setData membuat data baru → trigger effect lagi → loop',
          'Karena fetch() selalu gagal',
          'Karena useState([]) salah',
          'Kode ini tidak menyebabkan infinite loop'
        ],
        correct: 0,
        explanation: 'Setiap kali setData dipanggil, reference `data` berubah (array baru), yang trigger effect lagi, yang fetch lagi, yang setData lagi... infinite loop!'
      }
    ]
  },

  // ─── MODULE 3: useContext ───
  {
    id: 'useContext',
    title: 'useContext',
    icon: '🌐',
    color: '#E17055',
    description: 'Sharing state global tanpa prop drilling, context patterns',
    theory: `**useContext** memungkinkan komponen mengakses data dari Context tanpa prop drilling.

**Konsep Level Menengah:**

1. **Membuat Context Pattern:**
\`\`\`jsx
const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
\`\`\`

2. **Custom Hook untuk Context:**
\`\`\`jsx
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme harus di dalam ThemeProvider');
  }
  return context;
}
\`\`\`

3. **Perhatikan Re-render** — Semua consumer re-render saat value berubah. Solusi: split context atau useMemo pada value.

4. **Kapan Pakai Context vs Props:**
   - Props: data yang hanya turun 1-2 level
   - Context: data yang dibutuhkan banyak komponen di berbagai level`,
    quiz: [
      {
        id: 'uc1',
        type: 'multiple-choice',
        question: 'Apa kegunaan utama useContext?',
        options: [
          'Mengakses data dari Context Provider tanpa prop drilling',
          'Membuat global variable',
          'Menggantikan Redux sepenuhnya',
          'Membuat side effect'
        ],
        correct: 0,
        explanation: 'useContext memungkinkan komponen mengonsumsi value dari Context Provider terdekat tanpa harus meneruskan props melalui setiap level komponen.'
      },
      {
        id: 'uc2',
        type: 'true-false',
        question: 'Semua komponen yang menggunakan useContext akan re-render saat value di Provider berubah, meskipun komponen hanya menggunakan sebagian value.',
        correct: true,
        explanation: 'Benar! Ini adalah salah satu kekurangan Context. Solusinya: pecah context menjadi beberapa context yang lebih kecil, atau gunakan useMemo pada value.'
      },
      {
        id: 'uc3',
        type: 'bug-hunt',
        question: 'Apa masalah di kode ini?\n```jsx\nfunction App() {\n  const [user, setUser] = useState(null);\n  \n  return (\n    <UserContext.Provider value={{ user, setUser }}>\n      <Header />\n      <Main />\n    </UserContext.Provider>\n  );\n}\n```',
        options: [
          'Object value baru dibuat setiap render, sebaiknya di-memoize dengan useMemo',
          'Tidak boleh passing setUser lewat Context',
          'UserContext harus dibuat di dalam komponen',
          'Tidak ada masalah, ini sudah benar untuk kebanyakan kasus'
        ],
        correct: 3,
        explanation: 'Secara teknis, object baru dibuat setiap render. Tapi untuk kebanyakan kasus, ini sudah cukup. Optimasi dengan useMemo hanya diperlukan jika terjadi performance issue.'
      },
      {
        id: 'uc4',
        type: 'code-completion',
        question: 'Lengkapi custom hook untuk mengakses ThemeContext dengan error handling:\n```jsx\nfunction useTheme() {\n  const context = useContext(ThemeContext);\n  if (_____) {\n    throw new Error("useTheme harus di dalam ThemeProvider");\n  }\n  return context;\n}\n```',
        options: [
          '!context || context === undefined',
          'context === null',
          'context.theme === undefined',
          'typeof context !== "object"'
        ],
        correct: 0,
        explanation: 'Cek apakah context falsy (undefined/null) untuk memastikan hook digunakan di dalam Provider yang benar.'
      },
      {
        id: 'uc5',
        type: 'multiple-choice',
        question: 'Bagaimana cara mengurangi re-render yang tidak perlu saat menggunakan Context?',
        options: [
          'Pecah menjadi beberapa Context yang lebih kecil (split context)',
          'Gunakan useEffect di dalam Provider',
          'Jangan gunakan Context sama sekali',
          'Tambahkan key prop di Provider'
        ],
        correct: 0,
        explanation: 'Split context memungkinkan komponen hanya subscribe ke data yang mereka butuhkan, mengurangi re-render yang tidak perlu.'
      }
    ]
  },

  // ─── MODULE 4: useReducer ───
  {
    id: 'useReducer',
    title: 'useReducer',
    icon: '⚙️',
    color: '#0984E3',
    description: 'Mengelola complex state logic dengan reducer pattern',
    theory: `**useReducer** adalah alternatif useState untuk state logic yang kompleks.

**Konsep Level Menengah:**

1. **Struktur Reducer:**
\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: 'INCREMENT' });
\`\`\`

2. **Kapan Pakai useReducer vs useState:**
   - useState: state sederhana, independen
   - useReducer: state saling terkait, logic kompleks, banyak action types

3. **Lazy Initialization:**
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, arg, init);
// init(arg) dipanggil untuk menghitung initial state
\`\`\`

4. **Dispatch Stabil** — dispatch function tidak pernah berubah referencenya, aman dipass ke child components.`,
    quiz: [
      {
        id: 'ur1',
        type: 'multiple-choice',
        question: 'Kapan sebaiknya memilih useReducer daripada useState?',
        options: [
          'Saat state memiliki banyak sub-values yang saling terkait dan logic update yang kompleks',
          'Selalu, karena useReducer lebih baik',
          'Hanya saat membuat form',
          'Saat state hanya berupa satu nilai primitif'
        ],
        correct: 0,
        explanation: 'useReducer ideal untuk state yang kompleks dengan banyak sub-values yang saling terkait, di mana setiap action mungkin mempengaruhi beberapa bagian state.'
      },
      {
        id: 'ur2',
        type: 'bug-hunt',
        question: 'Temukan bug di reducer ini:\n```jsx\nfunction reducer(state, action) {\n  switch (action.type) {\n    case "ADD_TODO":\n      state.todos.push(action.payload);\n      return state;\n    case "TOGGLE":\n      state.todos[action.index].done = !state.todos[action.index].done;\n      return state;\n  }\n}\n```',
        options: [
          'Mutasi langsung pada state (push & assignment). Harus return object baru',
          'switch tanpa default case',
          'Kedua jawaban di atas benar',
          'Tidak ada bug'
        ],
        correct: 2,
        explanation: 'Ada 2 masalah: (1) State dimutasi langsung dengan push() dan assignment, seharusnya buat object/array baru. (2) Tidak ada default case yang bisa throw error untuk unknown action.'
      },
      {
        id: 'ur3',
        type: 'true-false',
        question: 'Fungsi `dispatch` dari useReducer memiliki referensi yang stabil (tidak berubah antar render), sehingga aman digunakan di dependency array.',
        correct: true,
        explanation: 'Benar! Tidak seperti fungsi setState dari useState, dispatch dijamin stabil. Ini membuatnya ideal untuk dipass ke child components tanpa menyebabkan re-render.'
      },
      {
        id: 'ur4',
        type: 'code-completion',
        question: 'Lengkapi reducer untuk shopping cart:\n```jsx\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case "ADD_ITEM":\n      return { ...state, items: _____ };\n    case "CLEAR":\n      return { ...state, items: [] };\n    default:\n      return state;\n  }\n}\n```',
        options: [
          '[...state.items, action.payload]',
          'state.items.push(action.payload)',
          'action.payload',
          '[action.payload]'
        ],
        correct: 0,
        explanation: 'Gunakan spread operator untuk menambah item baru ke array tanpa mutasi: `[...state.items, action.payload]`'
      },
      {
        id: 'ur5',
        type: 'multiple-choice',
        question: 'Apa parameter ketiga (opsional) di `useReducer(reducer, arg, init)`?',
        options: [
          'Fungsi untuk lazy initialization — init(arg) menghitung initial state',
          'Middleware function',
          'Cleanup function',
          'Validator function'
        ],
        correct: 0,
        explanation: 'Parameter ketiga adalah init function untuk lazy initialization. `init(arg)` dipanggil sekali untuk menghitung initial state, mirip lazy initialization di useState.'
      }
    ]
  },

  // ─── MODULE 5: useMemo ───
  {
    id: 'useMemo',
    title: 'useMemo',
    icon: '🧠',
    color: '#FDCB6E',
    description: 'Memoize hasil komputasi untuk optimasi performa',
    theory: `**useMemo** meng-cache hasil komputasi mahal agar tidak dihitung ulang setiap render.

**Konsep Level Menengah:**

1. **Kapan Menggunakan useMemo:**
\`\`\`jsx
// ✅ Komputasi mahal
const sorted = useMemo(() => {
  return hugeArray.sort((a, b) => a - b);
}, [hugeArray]);

// ❌ Tidak perlu — komputasi ringan
const fullName = useMemo(() => first + ' ' + last, [first, last]);
\`\`\`

2. **Referential Equality** — useMemo juga berguna untuk menjaga referensi object/array:
\`\`\`jsx
const options = useMemo(() => ({ color, size }), [color, size]);
// options hanya berubah jika color atau size berubah
\`\`\`

3. **Jangan Overuse** — useMemo sendiri punya cost (menyimpan & membandingkan). Gunakan hanya saat ada bukti performance issue.

4. **React bisa "lupa" memo** — React tidak menjamin cache akan selalu dipertahankan. Kode harus tetap bekerja tanpa useMemo.`,
    quiz: [
      {
        id: 'um1',
        type: 'multiple-choice',
        question: 'Apa tujuan utama useMemo?',
        options: [
          'Meng-cache hasil komputasi agar tidak dihitung ulang setiap render',
          'Membuat komponen menjadi pure component',
          'Menggantikan useState untuk performa lebih baik',
          'Membuat global cache'
        ],
        correct: 0,
        explanation: 'useMemo menyimpan (memoize) hasil komputasi dan hanya menghitung ulang jika dependencies berubah.'
      },
      {
        id: 'um2',
        type: 'true-false',
        question: 'useMemo menjamin bahwa nilai yang di-cache tidak akan pernah dihitung ulang selama dependencies tidak berubah.',
        correct: false,
        explanation: 'Salah! React tidak menjamin cache akan selalu dipertahankan. Dalam situasi tertentu, React bisa membuang cache. Kode harus tetap bekerja tanpa useMemo.'
      },
      {
        id: 'um3',
        type: 'bug-hunt',
        question: 'Apa masalah dengan kode ini?\n```jsx\nfunction UserList({ users }) {\n  const name = useMemo(() => users[0].name, []);\n  return <p>{name}</p>;\n}\n```',
        options: [
          'Dependencies array kosong — `users` harus masuk dependencies agar update saat prop berubah',
          'useMemo tidak bisa return string',
          'Harus pakai useCallback',
          'Tidak ada masalah'
        ],
        correct: 0,
        explanation: '`users` digunakan di dalam useMemo tapi tidak ada di dependencies. Saat prop `users` berubah, name tidak akan update karena memo masih mengembalikan nilai lama.'
      },
      {
        id: 'um4',
        type: 'multiple-choice',
        question: 'Manakah yang TIDAK perlu menggunakan useMemo?',
        options: [
          'Menggabungkan dua string: `firstName + " " + lastName`',
          'Sorting array dengan 10.000 item',
          'Filtering dan mapping array besar berdasarkan search query',
          'Menghitung Fibonacci ke-40'
        ],
        correct: 0,
        explanation: 'String concatenation sangat murah, tidak perlu di-memoize. useMemo sendiri punya overhead, jadi jangan gunakan untuk operasi ringan.'
      },
      {
        id: 'um5',
        type: 'code-completion',
        question: 'Lengkapi kode untuk memoize hasil filtering:\n```jsx\nconst filteredUsers = useMemo(\n  () => users.filter(u => u.name.includes(search)),\n  _____\n);\n```',
        options: [
          '[users, search]',
          '[users]',
          '[search]',
          '[]'
        ],
        correct: 0,
        explanation: 'Dependencies harus mencakup semua nilai yang digunakan di dalam useMemo: `users` dan `search`. Jika salah satu berubah, filter perlu dihitung ulang.'
      }
    ]
  },

  // ─── MODULE 6: useCallback ───
  {
    id: 'useCallback',
    title: 'useCallback',
    icon: '📦',
    color: '#A29BFE',
    description: 'Memoize fungsi untuk mencegah re-render child components',
    theory: `**useCallback** meng-cache definisi fungsi agar referensinya stabil antar render.

**Konsep Level Menengah:**

1. **useCallback vs useMemo:**
\`\`\`jsx
// Keduanya equivalen:
const fn = useCallback(() => doSomething(a), [a]);
const fn = useMemo(() => () => doSomething(a), [a]);
\`\`\`

2. **Kapan Menggunakan useCallback:**
\`\`\`jsx
// ✅ Berguna — child component di-wrap dengan React.memo
const handleClick = useCallback(() => {
  setCount(prev => prev + 1);
}, []);

<MemoizedChild onClick={handleClick} />
\`\`\`

3. **Kapan TIDAK Perlu:**
   - Child component tidak di-wrap React.memo
   - Fungsi hanya dipakai di element HTML biasa (<button>, <input>)
   - Tidak ada performance issue

4. **Gunakan dengan React.memo** — useCallback tanpa React.memo di child = sia-sia.`,
    quiz: [
      {
        id: 'ucb1',
        type: 'multiple-choice',
        question: 'Apa hubungan useCallback dan useMemo?',
        options: [
          'useCallback(fn, deps) sama dengan useMemo(() => fn, deps)',
          'useCallback untuk async, useMemo untuk sync',
          'Tidak ada hubungan',
          'useMemo menggantikan useCallback di React 18'
        ],
        correct: 0,
        explanation: '`useCallback(fn, deps)` adalah shortcut untuk `useMemo(() => fn, deps)`. Keduanya meng-cache, bedanya useCallback khusus untuk fungsi.'
      },
      {
        id: 'ucb2',
        type: 'true-false',
        question: 'Menggunakan useCallback di setiap fungsi event handler selalu meningkatkan performa.',
        correct: false,
        explanation: 'Salah! useCallback sendiri punya overhead. Tanpa React.memo di child component, useCallback tidak memberikan manfaat. Premature optimization bisa malah merugikan.'
      },
      {
        id: 'ucb3',
        type: 'multiple-choice',
        question: 'Kapan useCallback benar-benar berguna?',
        options: [
          'Saat fungsi dipass ke child component yang di-wrap React.memo',
          'Setiap kali membuat event handler',
          'Saat menggunakan useState',
          'Hanya di class component'
        ],
        correct: 0,
        explanation: 'useCallback berguna saat fungsi dipass ke child yang di-memo atau digunakan sebagai dependency di useEffect/useMemo. Tanpa itu, ia sia-sia.'
      },
      {
        id: 'ucb4',
        type: 'bug-hunt',
        question: 'Mengapa optimasi ini tidak bekerja?\n```jsx\nfunction Parent() {\n  const handleClick = useCallback(() => {\n    console.log("clicked");\n  }, []);\n\n  return <Child onClick={handleClick} />;\n}\n\nfunction Child({ onClick }) {\n  console.log("Child rendered");\n  return <button onClick={onClick}>Click</button>;\n}\n```',
        options: [
          'Child tidak di-wrap React.memo, jadi tetap re-render saat Parent re-render',
          'useCallback dependencies salah',
          'handleClick seharusnya pakai useMemo',
          'Optimasi ini sudah bekerja dengan benar'
        ],
        correct: 0,
        explanation: 'useCallback menjaga referensi fungsi stabil, tapi tanpa `React.memo(Child)`, Child tetap re-render setiap Parent render. Keduanya harus digunakan bersama.'
      },
      {
        id: 'ucb5',
        type: 'code-completion',
        question: 'Lengkapi kode agar optimasi bekerja:\n```jsx\nconst handleDelete = useCallback((id) => {\n  setItems(prev => prev.filter(item => item.id !== id));\n}, []);\n\nconst MemoizedItem = _____;\n```',
        options: [
          'React.memo(Item)',
          'useMemo(Item)',
          'useCallback(Item)',
          'React.createRef(Item)'
        ],
        correct: 0,
        explanation: 'React.memo() membungkus komponen agar hanya re-render saat props berubah. Bersama useCallback, ini mencegah re-render yang tidak perlu.'
      }
    ]
  },

  // ─── MODULE 7: useRef ───
  {
    id: 'useRef',
    title: 'useRef',
    icon: '📌',
    color: '#E84393',
    description: 'DOM manipulation, mutable values, dan previous value pattern',
    theory: `**useRef** membuat mutable reference yang persist antar render tanpa menyebabkan re-render.

**Konsep Level Menengah:**

1. **DOM Reference:**
\`\`\`jsx
const inputRef = useRef(null);
// Fokus input saat mount
useEffect(() => {
  inputRef.current.focus();
}, []);
return <input ref={inputRef} />;
\`\`\`

2. **Mutable Value (tanpa re-render):**
\`\`\`jsx
const renderCount = useRef(0);
useEffect(() => {
  renderCount.current += 1; // tidak trigger re-render
});
\`\`\`

3. **Previous Value Pattern:**
\`\`\`jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
\`\`\`

4. **Interval/Timer Reference:**
\`\`\`jsx
const timerRef = useRef(null);
const start = () => { timerRef.current = setInterval(...) };
const stop = () => { clearInterval(timerRef.current) };
\`\`\``,
    quiz: [
      {
        id: 'urf1',
        type: 'multiple-choice',
        question: 'Apa perbedaan utama useRef dan useState?',
        options: [
          'Mengubah ref.current TIDAK menyebabkan re-render, sedangkan setState menyebabkan re-render',
          'useRef lebih cepat dari useState',
          'useRef hanya untuk DOM element',
          'useState tidak bisa menyimpan object'
        ],
        correct: 0,
        explanation: 'Perbedaan kunci: mengubah `.current` di ref tidak trigger re-render, sementara setState selalu trigger re-render. Ini membuat ref ideal untuk nilai yang tidak perlu ditampilkan di UI.'
      },
      {
        id: 'urf2',
        type: 'true-false',
        question: 'useRef hanya bisa digunakan untuk menyimpan referensi ke DOM element.',
        correct: false,
        explanation: 'Salah! useRef bisa menyimpan nilai apa saja: timer ID, previous values, instance variables, dll. DOM reference hanya salah satu use case.'
      },
      {
        id: 'urf3',
        type: 'code-completion',
        question: 'Lengkapi custom hook usePrevious:\n```jsx\nfunction usePrevious(value) {\n  const ref = useRef();\n  useEffect(() => {\n    _____;\n  });\n  return ref.current;\n}\n```',
        options: [
          'ref.current = value',
          'ref = value',
          'ref.current = ref',
          'return value'
        ],
        correct: 0,
        explanation: 'Di dalam useEffect (yang berjalan setelah render), kita simpan value saat ini ke ref. Saat render berikutnya, ref.current masih menyimpan value sebelumnya karena useEffect belum jalan lagi.'
      },
      {
        id: 'urf4',
        type: 'bug-hunt',
        question: 'Apa masalah kode ini?\n```jsx\nfunction Timer() {\n  let intervalId = null;\n  \n  const start = () => {\n    intervalId = setInterval(() => console.log("tick"), 1000);\n  };\n  \n  const stop = () => {\n    clearInterval(intervalId);\n  };\n}\n```',
        options: [
          'intervalId direset setiap render. Harus pakai useRef agar persist antar render',
          'setInterval tidak bisa dipakai di React',
          'clearInterval salah syntax',
          'Tidak ada masalah'
        ],
        correct: 0,
        explanation: 'Variable biasa (let) direset setiap render. Saat `stop` dipanggil, `intervalId` sudah null. Gunakan `useRef` agar nilainya persist: `const intervalRef = useRef(null)`'
      },
      {
        id: 'urf5',
        type: 'multiple-choice',
        question: 'Mengapa useRef cocok untuk menyimpan timer/interval ID?',
        options: [
          'Karena nilainya persist antar render dan mengubahnya tidak trigger re-render',
          'Karena useRef lebih cepat',
          'Karena timer harus di DOM',
          'Karena useState tidak bisa menyimpan number'
        ],
        correct: 0,
        explanation: 'Timer ID perlu persist tapi tidak perlu ditampilkan di UI. useRef perfect: nilainya bertahan antar render, dan mengubahnya tidak menyebabkan re-render yang tidak perlu.'
      }
    ]
  },

  // ─── MODULE 8: Custom Hooks ───
  {
    id: 'customHooks',
    title: 'Custom Hooks',
    icon: '🛠️',
    color: '#00CEC9',
    description: 'Membuat reusable hooks sendiri untuk logic yang bisa di-share',
    theory: `**Custom Hooks** memungkinkan kamu mengekstrak logic komponen menjadi reusable functions.

**Konsep Level Menengah:**

1. **Rules:**
   - Nama HARUS dimulai dengan "use" (useLocalStorage, useFetch)
   - Bisa memanggil hooks lain di dalamnya
   - Setiap komponen yang memakainya mendapat state SENDIRI (tidak shared)

2. **Contoh useLocalStorage:**
\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
\`\`\`

3. **Contoh useFetch:**
\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => !cancelled && setData(data))
      .catch(err => !cancelled && setError(err))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
\`\`\`

4. **Kapan Membuat Custom Hook:**
   - Logic yang sama diulang di 2+ komponen
   - Logic yang kompleks dan membuat komponen sulit dibaca
   - Logic yang bisa di-test secara independen`,
    quiz: [
      {
        id: 'ch1',
        type: 'multiple-choice',
        question: 'Apa aturan penamaan custom hook?',
        options: [
          'Harus dimulai dengan "use" (contoh: useMyHook)',
          'Harus dimulai dengan "hook" (contoh: hookMyLogic)',
          'Harus dimulai dengan underscore (contoh: _myHook)',
          'Bebas, tidak ada aturan khusus'
        ],
        correct: 0,
        explanation: 'Custom hook WAJIB dimulai dengan "use". Ini bukan hanya konvensi, React linter menggunakan prefix ini untuk mengecek rules of hooks.'
      },
      {
        id: 'ch2',
        type: 'true-false',
        question: 'Dua komponen yang menggunakan custom hook yang sama akan berbagi state yang sama.',
        correct: false,
        explanation: 'Salah! Setiap komponen yang memanggil custom hook mendapat INSTANCE state sendiri. Custom hook hanya berbagi LOGIC, bukan state.'
      },
      {
        id: 'ch3',
        type: 'bug-hunt',
        question: 'Apa masalah dengan custom hook ini?\n```jsx\nfunction useWindowSize() {\n  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });\n  \n  window.addEventListener("resize", () => {\n    setSize({ w: window.innerWidth, h: window.innerHeight });\n  });\n  \n  return size;\n}\n```',
        options: [
          'Event listener ditambahkan setiap render tanpa cleanup. Harus di useEffect dengan cleanup',
          'useState tidak bisa menyimpan object',
          'window.innerWidth tidak tersedia di React',
          'Tidak ada masalah'
        ],
        correct: 0,
        explanation: 'addEventListener dipanggil langsung di body hook = setiap render menambah listener baru tanpa membersihkan yang lama → memory leak! Harus di useEffect dengan cleanup.'
      },
      {
        id: 'ch4',
        type: 'code-completion',
        question: 'Lengkapi custom hook useToggle:\n```jsx\nfunction useToggle(initialValue = false) {\n  const [value, setValue] = useState(initialValue);\n  const toggle = useCallback(() => {\n    setValue(prev => _____);\n  }, []);\n  return [value, toggle];\n}\n```',
        options: [
          '!prev',
          'prev + 1',
          'true',
          'prev === false'
        ],
        correct: 0,
        explanation: 'Toggle berarti membalik nilai boolean: `!prev`. Jika true jadi false, jika false jadi true.'
      },
      {
        id: 'ch5',
        type: 'multiple-choice',
        question: 'Kapan sebaiknya TIDAK membuat custom hook?',
        options: [
          'Saat logic hanya digunakan di satu komponen dan tidak kompleks',
          'Saat logic digunakan di 3+ komponen',
          'Saat logic melibatkan useEffect dan useState',
          'Saat ingin membuat kode lebih testable'
        ],
        correct: 0,
        explanation: 'Jika logic sederhana dan hanya dipakai di satu tempat, custom hook justru menambah complexity tanpa manfaat. Extract ke custom hook saat logic diulang atau sangat kompleks.'
      }
    ]
  }
];

// ─── CODING CHALLENGES ───
export const codingChallenges = [
  {
    id: 1,
    hook: 'useState',
    title: '📝 Todo App dengan Filter & Sorting',
    difficulty: '⭐⭐',
    description: 'Buat Todo App yang bisa menambah, menghapus, dan toggle status todo. Tambahkan fitur filter (All/Active/Completed) dan sorting (A-Z, Z-A, terbaru).',
    requirements: [
      'Tambah todo baru dengan input + tombol',
      'Toggle status done/undone',
      'Hapus todo',
      'Filter: All, Active, Completed',
      'Sorting: A-Z, Z-A, Terbaru dulu',
      'Tampilkan counter todo yang belum selesai'
    ],
    hints: [
      'Gunakan updater function: setTodos(prev => ...)',
      'State filter dan sort bisa pakai useState terpisah',
      'Jangan lupa immutability saat update array'
    ],
    bonusPoints: 'Edit todo inline, localStorage persist, animasi'
  },
  {
    id: 2,
    hook: 'useEffect',
    title: '🌐 Data Fetching Dashboard',
    difficulty: '⭐⭐⭐',
    description: 'Buat dashboard yang fetch data dari API publik dengan loading state, error handling, dan auto-refresh.',
    requirements: [
      'Fetch data dari API (bisa pakai JSONPlaceholder)',
      'Tampilkan loading spinner saat fetching',
      'Handle error dengan pesan yang user-friendly',
      'Auto-refresh setiap 30 detik',
      'Tombol manual refresh',
      'Cleanup saat component unmount'
    ],
    hints: [
      'Gunakan cancelled flag untuk race condition',
      'setInterval di useEffect untuk auto-refresh',
      'Jangan lupa cleanup function!'
    ],
    bonusPoints: 'Pagination, search/filter, skeleton loading'
  },
  {
    id: 3,
    hook: 'useContext',
    title: '🎨 Theme & Language Switcher',
    difficulty: '⭐⭐',
    description: 'Buat app dengan tema gelap/terang dan bahasa Indonesia/Inggris menggunakan Context.',
    requirements: [
      'ThemeContext: dark/light mode toggle',
      'LanguageContext: ID/EN switch',
      'Semua komponen mengakses theme & bahasa dari Context',
      'Custom hook: useTheme() dan useLanguage()',
      'Minimal 3 komponen yang menggunakan Context',
      'Persist pilihan ke localStorage'
    ],
    hints: [
      'Buat Provider terpisah untuk Theme dan Language',
      'Custom hook dengan error handling jika di luar Provider',
      'Gunakan CSS custom properties untuk theme'
    ],
    bonusPoints: 'Animasi transisi theme, auto-detect system preference'
  },
  {
    id: 4,
    hook: 'useReducer',
    title: '🛒 Shopping Cart',
    difficulty: '⭐⭐⭐',
    description: 'Buat shopping cart dengan useReducer untuk mengelola state yang kompleks.',
    requirements: [
      'Daftar produk dengan tombol Add to Cart',
      'Cart: tambah, kurangi quantity, hapus item',
      'Hitung total harga dan total item',
      'Action types: ADD, REMOVE, INCREMENT, DECREMENT, CLEAR',
      'Tampilkan cart summary',
      'Dispatch untuk semua operasi'
    ],
    hints: [
      'Definisikan initial state dengan items: [], total: 0',
      'Reducer harus return state baru (immutable)',
      'Cek apakah item sudah ada di cart sebelum add'
    ],
    bonusPoints: 'Promo code/diskon, undo last action, animasi'
  },
  {
    id: 5,
    hook: 'useMemo & useCallback',
    title: '📊 Performance-Optimized List',
    difficulty: '⭐⭐⭐',
    description: 'Buat app dengan list besar (1000+ item) yang dioptimasi performanya.',
    requirements: [
      'Generate 1000+ item dummy',
      'Search/filter yang responsif',
      'Sorting dengan useMemo',
      'Event handlers dengan useCallback',
      'Child components dengan React.memo',
      'Tampilkan render count untuk bukti optimasi'
    ],
    hints: [
      'useMemo untuk hasil filter & sort',
      'useCallback untuk fungsi yang dipass ke child',
      'React.memo untuk child component',
      'Render count pakai useRef'
    ],
    bonusPoints: 'Virtual scrolling, debounced search, performance metrics'
  },
  {
    id: 6,
    hook: 'useRef',
    title: '⏱️ Stopwatch & Form Manager',
    difficulty: '⭐⭐',
    description: 'Buat stopwatch yang presisi dan form dengan auto-focus.',
    requirements: [
      'Stopwatch: start, stop, reset, lap times',
      'Presisi hingga milidetik',
      'Form: auto-focus ke input pertama saat mount',
      'Focus ke input yang error saat submit',
      'Simpan interval ID di useRef',
      'Track render count dengan useRef'
    ],
    hints: [
      'useRef untuk interval ID — jangan pakai state!',
      'useRef untuk DOM references (input focus)',
      'Display time pakai state, interval ID pakai ref'
    ],
    bonusPoints: 'Keyboard shortcuts, animasi, sound effects'
  },
  {
    id: 7,
    hook: 'Custom Hooks',
    title: '🛠️ Custom Hooks Library',
    difficulty: '⭐⭐⭐',
    description: 'Buat minimal 3 custom hooks yang reusable dan demo penggunaannya.',
    requirements: [
      'useLocalStorage(key, initialValue) — sync state ke localStorage',
      'useFetch(url) — return { data, loading, error }',
      'useDebounce(value, delay) — debounce sebuah nilai',
      'Setiap hook harus proper cleanup',
      'Demo page yang menunjukkan semua hooks bekerja',
      'Error handling di setiap hook'
    ],
    hints: [
      'useLocalStorage: lazy initialization + useEffect sync',
      'useFetch: cancelled flag untuk cleanup',
      'useDebounce: setTimeout di useEffect'
    ],
    bonusPoints: 'useMediaQuery, useOnClickOutside, TypeScript types'
  },
  {
    id: 8,
    hook: 'All Hooks',
    title: '🏆 Final Boss: Mini E-Commerce',
    difficulty: '⭐⭐⭐⭐',
    description: 'Gabungkan semua hooks dalam mini e-commerce app!',
    requirements: [
      'Product listing dengan search & filter (useState, useMemo)',
      'Data fetching dari API (useEffect, custom useFetch)',
      'Shopping cart (useReducer)',
      'Theme dark/light (useContext)',
      'Optimized product cards (useCallback, React.memo)',
      'Form input refs (useRef)',
      'Custom hooks: useCart, useProducts, useLocalStorage'
    ],
    hints: [
      'Mulai dari data layer (custom hooks)',
      'Lalu buat Context providers',
      'Terakhir, komponen UI',
      'Test setiap fitur secara terpisah'
    ],
    bonusPoints: 'Responsive design, animasi, checkout flow, wishlist'
  }
];
