import React, { useEffect, useRef, useState } from "react";

/**
 * ------------------------------------------------------------
 * 共有：丸ボタン（クリック取りこぼし防止 & バリアント対応）
 * ------------------------------------------------------------
 */
function CircleBtn({
  children,
  onClick,
  title,
  ariaLabel,
  onMouseDownExtra,
  variant = "default",
}) {
  // variant: default(グレー) | danger(赤) | info(水色)
  const base =
    "relative inline-grid place-items-center select-none cursor-pointer active:translate-y-[1px] leading-none z-10 rounded-full border-2";
  const size = "w-7 h-7";
  const styles =
    variant === "danger"
      ? "border-red-600 text-red-700 bg-white hover:bg-red-50"
      : variant === "info"
      ? "border-sky-500 text-sky-600 bg-white hover:bg-sky-50"
      : "border-gray-600 text-gray-800 bg-white hover:bg-gray-50";
  return (
    <button
      type="button"
      aria-label={ariaLabel || title}
      title={title}
      onMouseDown={(e) => {
        // フォーカス移動による input の onBlur 先行発火を防ぐ
        e.preventDefault();
        e.stopPropagation();
        onMouseDownExtra?.(e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onMouseDownExtra?.(e);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      className={[base, size, styles].join(" ")}
    >
      <span className="pointer-events-none">{children}</span>
    </button>
  );
}

/** 一意ID生成 */
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/**
 * ------------------------------------------------------------
 * メイン：ジャンル & タスク UI
 * ------------------------------------------------------------
 */
export const genreData = [
  {
    id: uid(),
    name: "家事",
    tasks: [
      { id: uid(), text: "買い物", done: true },
      { id: uid(), text: "洗濯", done: true },
      { id: uid(), text: "掃除", done: false },
      { id: uid(), text: "申請", done: true },
    ],
  },
  { id: uid(), name: "仕事", tasks: [] },
  { id: uid(), name: "勉強", tasks: [] },
];

export default function GenreTaskManager() {
  const [genres, setGenres] = useState([
    {
      id: uid(),
      name: "家事",
      tasks: [
        { id: uid(), text: "買い物", done: true },
        { id: uid(), text: "洗濯", done: true },
        { id: uid(), text: "掃除", done: false },
        { id: uid(), text: "申請", done: true },
      ],
    },
    { id: uid(), name: "仕事", tasks: [] },
    { id: uid(), name: "勉強", tasks: [] },
  ]);

  const [activeId, setActiveId] = useState(null);

  // インライン編集（ジャンル名）
  const [editingGenreId, setEditingGenreId] = useState(null);
  const [genreDraft, setGenreDraft] = useState("");

  // インライン編集（タスク名）
  const [editingTask, setEditingTask] = useState({
    genreId: null,
    taskId: null,
  });
  const [taskDraft, setTaskDraft] = useState("");

  // クリック時に input onBlur をスキップするためのフラグ
  const suppressBlurRef = useRef(false);

  // 初期選択
  useEffect(() => {
    if (activeId == null && genres.length > 0) setActiveId(genres[0].id);
  }, [activeId, genres.length]);

  // --- ジャンル追加（＋後すぐに新しい四角でキャレット点滅＆入力） ---
  const startAddGenre = () => {
    const g = { id: uid(), name: "", tasks: [] };
    setGenres((prev) => [...prev, g]);
    setActiveId(g.id);
    setEditingGenreId(g.id);
    setGenreDraft("");
  };

  // --- ジャンル削除（ID基準で確実に削除） ---
  const removeGenre = (genreId) => {
    // 確認ダイアログなしで即時削除（UX安定のため）
    setGenres((prev) => {
      const next = prev.filter((g) => g.id !== genreId);
      // アクティブIDの整合
      setActiveId((cur) => (cur === genreId ? next[0]?.id ?? null : cur));
      return next;
    });
    // 編集状態のクリア
    setEditingGenreId((cur) => (cur === genreId ? null : cur));
  };

  // --- ジャンル名編集 ---
  const beginEditGenre = (e, genreId) => {
    e.stopPropagation();
    const g = genres.find((x) => x.id === genreId);
    setEditingGenreId(genreId);
    setGenreDraft(g?.name || "");
  };
  const commitEditGenre = () => {
    let v = (genreDraft || "").trim();
    if (!v) {
      // 何も入力されなかった場合はデフォ名を付与
      const index = genres.findIndex((x) => x.id === editingGenreId);
      v = `新しいジャンル${index + 1}`;
    }
    setGenres((prev) =>
      prev.map((g) => (g.id === editingGenreId ? { ...g, name: v } : g))
    );
    setEditingGenreId(null);
  };
  const cancelEditGenre = () => {
    // 空のままキャンセルされたらデフォ名
    if ((genreDraft || "").trim() === "") {
      const index = genres.findIndex((x) => x.id === editingGenreId);
      const v = `新しいジャンル${index + 1}`;
      setGenres((prev) =>
        prev.map((g) => (g.id === editingGenreId ? { ...g, name: v } : g))
      );
    }
    setEditingGenreId(null);
    setGenreDraft("");
  };

  // --- タスク操作（ID基準） ---
  const addTask = (genreId, text) => {
    const v = (text || "").trim();
    if (!v) return;
    const t = { id: uid(), text: v, done: false };
    setGenres((prev) =>
      prev.map((g) => (g.id === genreId ? { ...g, tasks: [...g.tasks, t] } : g))
    );
    setEditingTask({ genreId, taskId: t.id });
    setTaskDraft(v);
  };

  const removeTask = (genreId, taskId) => {
    setGenres((prev) =>
      prev.map((g) =>
        g.id === genreId
          ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
          : g
      )
    );
    setEditingTask((cur) =>
      cur.genreId === genreId && cur.taskId === taskId
        ? { genreId: null, taskId: null }
        : cur
    );
    setTaskDraft("");
  };

  const toggleTask = (genreId, taskId) => {
    setGenres((prev) =>
      prev.map((g) =>
        g.id === genreId
          ? {
              ...g,
              tasks: g.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : g
      )
    );
  };

  // --- タスク編集 ---
  const beginEditTask = (genreId, taskId) => {
    const g = genres.find((x) => x.id === genreId);
    const t = g?.tasks.find((x) => x.id === taskId);
    setEditingTask({ genreId, taskId });
    setTaskDraft(t?.text || "");
  };
  const commitEditTask = () => {
    const { genreId, taskId } = editingTask;
    const v = (taskDraft || "").trim();
    if (!v) return cancelEditTask();
    setGenres((prev) =>
      prev.map((g) =>
        g.id === genreId
          ? {
              ...g,
              tasks: g.tasks.map((t) =>
                t.id === taskId ? { ...t, text: v } : t
              ),
            }
          : g
      )
    );
    setEditingTask({ genreId: null, taskId: null });
    setTaskDraft("");
  };
  const cancelEditTask = () => {
    setEditingTask({ genreId: null, taskId: null });
    setTaskDraft("");
  };

  return (
    <div className="p-4 max-w-sm">
      {/* 上部バー */}
      <div className="flex items-center gap-2 mb-3">
        <CircleBtn
          title="ジャンルを追加"
          ariaLabel="ジャンルを追加"
          onClick={startAddGenre}
          onMouseDownExtra={() => {
            // 追加ボタンでの onBlur 先行発火を防ぐ
            suppressBlurRef.current = true;
          }}
        >
          ＋
        </CircleBtn>
        <div className="border-2 border-gray-600 px-3 py-1 rounded-lg font-semibold bg-white">
          ジャンル
        </div>
      </div>

      {/* ジャンル一覧 */}
      <div className="flex flex-col gap-3">
        {genres.map((g) => (
          <div
            key={g.id}
            className={`border-2 border-gray-600 rounded-lg px-2 py-1 ${
              activeId === g.id ? "bg-gray-300" : "bg-white"
            }`}
            onClick={() => setActiveId(g.id)}
            role="button"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">^</span>

              {/* ジャンル名：表示 or 入力（追加直後は入力でキャレット点滅） */}
              {editingGenreId === g.id ? (
                <input
                  autoFocus
                  value={genreDraft}
                  onChange={(e) => setGenreDraft(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitEditGenre();
                    if (e.key === "Escape") cancelEditGenre();
                  }}
                  onBlur={() => {
                    // ボタン操作で発生した blur はスキップ（クリック後にリセット）
                    if (suppressBlurRef.current) return;
                    commitEditGenre();
                  }}
                  placeholder="ジャンル名を入力"
                  className="flex-1 border-2 border-gray-600 rounded px-2 py-0.5 font-semibold"
                />
              ) : (
                <button
                  onClick={() => setActiveId(g.id)}
                  onDoubleClick={(e) => beginEditGenre(e, g.id)}
                  className="font-semibold flex-1 text-left"
                  title="ダブルクリックで名前を編集"
                >
                  {g.name || "(名前未設定)"}
                </button>
              )}

              <CircleBtn
                variant="info"
                title="ジャンルを削除"
                ariaLabel="ジャンルを削除"
                onMouseDownExtra={() => {
                  suppressBlurRef.current = true;
                }}
                onClick={() => {
                  // クリック処理の最後にフラグ解除
                  removeGenre(g.id);
                  suppressBlurRef.current = false;
                }}
              >
                －
              </CircleBtn>
            </div>

            {/* タスク表示 */}
            {activeId === g.id && (
              <div className="ml-5 mt-2 border-l-2 border-gray-400 pl-2">
                {g.tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 mb-1">
                    {/* タスク名：表示 or 入力 */}
                    {editingTask.genreId === g.id &&
                    editingTask.taskId === t.id ? (
                      <input
                        autoFocus
                        value={taskDraft}
                        onChange={(e) => setTaskDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitEditTask();
                          if (e.key === "Escape") cancelEditTask();
                        }}
                        onBlur={commitEditTask}
                        className="flex-1 border-2 border-gray-600 rounded px-2 py-0.5"
                      />
                    ) : (
                      <label className="flex items-center gap-2 flex-1">
                        <input
                          type="checkbox"
                          checked={t.done}
                          onChange={() => toggleTask(g.id, t.id)}
                        />
                        <span
                          onDoubleClick={() => beginEditTask(g.id, t.id)}
                          title="ダブルクリックで編集"
                        >
                          {t.text}
                        </span>
                      </label>
                    )}

                    <CircleBtn
                      title="タスクを削除"
                      ariaLabel="タスクを削除"
                      onClick={() => removeTask(g.id, t.id)}
                    >
                      －
                    </CircleBtn>
                  </div>
                ))}

                {/* タスク追加（＋ボタンなし・Enter/フォーカス外しで追加） */}
                <TaskInput onAdd={(txt) => addTask(g.id, txt)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** タスク入力（Enter or blur で追加） */
function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const commit = () => {
    const v = (text || "").trim();
    if (!v) return;
    onAdd(v);
    setText("");
  };
  return (
    <div className="mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        onBlur={() => commit()}
        placeholder="タスク"
        className="w-full border-2 border-gray-600 rounded px-2 py-1"
      />
    </div>
  );
}
