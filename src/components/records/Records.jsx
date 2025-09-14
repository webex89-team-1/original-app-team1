import { useState } from "react";

//棒グラフのRechartsからの挿入
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./Records.css";

//ダミーデータ
const data = [
  { day: "1日目", time: 800 },
  { day: "2日目", time: 300 },
  { day: "3日目", time: 150 },
];

function Records() {
  const [showGraph, setShowGraph] = useState(false);

  //平均時間を表示
  const total = data.reduce((sum, item) => sum + item.time, 0);
  const avg = Math.round(total / data.length);
  const hours = Math.floor(avg / 60);
  const minutes = avg % 60;
  const avgTime = `${hours}:${minutes.toString().padStart(2, "0")}`;

  return (
    <div className="records">
      <button
        className="graph-show-button"
        onClick={() => setShowGraph(!showGraph)}
      >
        {showGraph ? "閉じる" : "開く"}
      </button>

      {showGraph && (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip cursor={{ fill: "#f0f0f0" }} />
              <Bar dataKey="time" fill="#deb887" />
            </BarChart>
          </ResponsiveContainer>

          {/*平均時間*/}
          <div className="average-time">
            <p>所要時間平均（直近3日間）</p>
            <h3>{avgTime}</h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Records;
