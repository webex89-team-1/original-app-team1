import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

// ---- 設定 ----
const STORAGE_KEY = "todayTasks.v1"; // ローカルストレージのキー
const GENRE_STORAGE_KEY = "genres.v1"; // ジャンル保存用キー

function App() {
  // ---- 状態 ----
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [genres, setGenres] = useState([]); // {id, name}

  // ---- 初期ロード ----
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch (e) {
      console.warn("failed to load tasks", e);
    }
    try {
      const graw = localStorage.getItem(GENRE_STORAGE_KEY);
      if (graw) {
        setGenres(JSON.parse(graw));
      } else {
        // デフォルトジャンル
        setGenres([
          { id: crypto.randomUUID ? crypto.randomUUID() : "g1", name: "家事" },
          { id: crypto.randomUUID ? crypto.randomUUID() : "g2", name: "仕事" },
          { id: crypto.randomUUID ? crypto.randomUUID() : "g3", name: "勉強" },
        ]);
      }
    } catch (e) {
      console.warn("failed to load genres", e);
    }
  }, []);

  // ---- 自動保存 ----
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn("failed to save tasks", e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(GENRE_STORAGE_KEY, JSON.stringify(genres));
    } catch (e) {
      console.warn("failed to save genres", e);
    }
  }, [genres]);

  // ---- タスクイベント ----
  const addTask = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    const newTask = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: t,
      time: time || undefined,
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTitle("");
    setTime("");
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const reloadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTasks(raw ? JSON.parse(raw) : []);
    } catch (e) {
      console.warn("failed to reload tasks", e);
    }
    try {
      const graw = localStorage.getItem(GENRE_STORAGE_KEY);
      setGenres(graw ? JSON.parse(graw) : []);
    } catch (e) {
      console.warn("failed to reload genres", e);
    }
  };

  // ---- ジャンル操作 ----
  const addGenre = () => {
    const name = prompt("ジャンル名を入力してください（例：家事）");
    if (!name) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    const newGenre = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      name: trimmed,
    };
    setGenres((prev) => [...prev, newGenre]);
  };

  const deleteGenre = (id) => {
    setGenres((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="container">
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .container { display: flex; min-height: 100vh; font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }
        .sidebar { width: 160px; background: #eeeeee; padding: 16px; display: flex; flex-direction: column; gap: 10px; }
        .sidebar button { padding: 10px; border: none; background: #dddddd; border-radius: 8px; cursor: pointer; }
        .sidebar button.active, .sidebar button:hover { background: #cfcfcf; }
        .main { flex: 1; padding: 20px; }
        .todo-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .genre, .today { border: 1px solid #aaa; border-radius: 10px; padding: 12px; background: #fff; }
        .genre-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .circle-btn { width:28px; height:28px; border-radius:999px; border:1px solid #888; background:#fff; cursor:pointer; line-height:26px; text-align:center; font-weight:600; }
        .circle-btn:hover { background:#f3f3f3; }
        .category-row { display:flex; align-items:center; justify-content:space-between; }
        .category-header { background: #d7d7d7; padding: 6px 8px; border-radius: 6px; margin-bottom: 6px; display: inline-block; }
        .genre-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
        .genre-title { background: #d7d7d7; padding: 6px 8px; border-radius: 6px; }
        .circle-btn { border: 1px solid #333; border-radius: 50%; width: 24px; height: 24px; text-align: center; line-height: 20px; cursor: pointer; background: #f5f5f5; }
        .today h3 { display: flex; justify-content: space-between; align-items: center; margin: 0 0 10px; }
        .icon-btn { border: none; background: transparent; cursor: pointer; font-size: 18px; }
        .add-form { display: flex; gap: 8px; margin-bottom: 12px; }
        .add-form input[type='text'] { flex: 1; padding: 8px 10px; border: 1px solid #bbb; border-radius: 8px; }
        .add-form input[type='time'] { padding: 8px 10px; border: 1px solid #bbb; border-radius: 8px; }
        .add-form button { padding: 8px 14px; border: none; border-radius: 8px; background: #333; color: #fff; cursor: pointer; }
        .add-form button:hover { opacity: 0.9; }
        .task-list { list-style: none; padding-left: 0; margin: 0; }
        .task-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 8px; }
        .task-text.done { text-decoration: line-through; opacity: 0.6; }
      `}</style>

      {/* サイドバー */}
      <aside className="sidebar">
        <button>Hello!</button>
        <button className="active">To Do</button>
        <button>Records</button>
        <button>Tips</button>
        <button>Share</button>
      </aside>

      {/* メイン */}
      <main className="main">
        <h2>ホーム画面（タブ）</h2>
        <div className="todo-section">
          {/* 左：ジャンル */}
          <section className="genre">
            <div className="genre-header">
              <button
                className="circle-btn"
                title="ジャンルを追加"
                onClick={addGenre}
              >
                ＋
              </button>
              <h3 style={{ margin: 0 }}>ジャンル</h3>
            </div>

            {genres.map((g) => (
              <div className="category" key={g.id}>
                <div className="category-row">
                  <div className="category-header">{g.name}</div>
                  <button
                    className="circle-btn"
                    title={`${g.name} を削除`}
                    onClick={() => deleteGenre(g.id)}
                  >
                    －
                  </button>
                </div>
                {g.name === "家事" && (
                  <ul>
                    <li>
                      <input type="checkbox" disabled /> 買い物
                    </li>
                    <li>
                      <input type="checkbox" disabled /> 洗濯
                    </li>
                    <li>
                      <input type="checkbox" disabled /> 掃除
                    </li>
                    <li>
                      <input type="checkbox" disabled /> 申請
                    </li>
                  </ul>
                )}
              </div>
            ))}
          </section>

          {/* 右：本日のタスク */}
          <section className="today">
            <h3>
              本日のタスク
              <button
                className="icon-btn"
                title="保存データを再読込"
                onClick={reloadFromStorage}
              >
                ⟳
              </button>
            </h3>

            {/* 追加フォーム */}
            <form className="add-form" onSubmit={addTask}>
              <input
                type="text"
                placeholder="タスク名（例：買い物）"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <button type="submit">追加</button>
            </form>

            {/* タスクリスト */}
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={!!task.done}
                    onChange={() => toggleDone(task.id)}
                  />
                  <span className={"task-text" + (task.done ? " done" : "")}>
                    {task.title}
                    {task.time ? ` ${task.time}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;

// --- 単体ファイルでのプレビュー用（ViCRA以外でも動くように） ---
const mount = () => {
  const rootEl = document.getElementById("root");
  if (rootEl) {
    const root = createRoot(rootEl);
    root.render(<App />);
  }
};

if (typeof document !== "undefined") {
  mount();
}
