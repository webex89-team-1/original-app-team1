import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { genreData } from "@/pages/DailyTaskList";

import "./Records.css";

// 仮のカテゴリ
const categories = [
  { id: "work", label: "仕事" },
  { id: "study", label: "勉強" },
  { id: "hobby", label: "趣味" },
];

function Records() {
  const [selectedCategory, setSelectedCategory] = useState("work");

  // 選択されたカテゴリのデータ
  const data = genreData?.[selectedCategory] || [];

  // 平均時間
  const calculateAverage = () => {
    if (!data || data.length === 0) return "0:00";

    const last3 = data.slice(-3);
    const total = last3.reduce((sum, item) => sum + item.time, 0);
    const avg = Math.round(total / last3.length);
    const hours = Math.floor(avg / 60);
    const minutes = avg % 60;

    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  return (
    <div className="records">
      {/* カテゴリーボタン */}
      <div className="category-buttons">
        {categories.map((category) => {
          const isActive = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              className={isActive ? "active" : "category-button"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          );
        })}
      </div>

      {/* グラフ */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="time" fill="#e0be92ff" />
        </BarChart>
      </ResponsiveContainer>

      {/* 平均時間 */}
      <div className="average-time">
        <p>所要時間平均（直近3日間）</p>
        <h3>{calculateAverage()}</h3>
      </div>
    </div>
  );
}

export default Records;
