import React, { useState, useEffect, useRef } from "react";
import "./Stopwatch.css"; // スタイルシートをインポート

const Stopwatch = () => {
  // タイマーが実行中かどうかを管理する状態
  const [isRunning, setIsRunning] = useState(false);
  // 経過時間をミリ秒で管理する状態
  const [elapsedTime, setElapsedTime] = useState(0);
  // 保存された記録のリストを管理する状態
  const [records, setRecords] = useState([]);

  // setIntervalのIDを保持するためのref（コンポーネントの再レンダリング時に変更されない）
  const timerIdRef = useRef(null);

  // タイマーの開始・停止ロジックを管理する副作用（effect）
  useEffect(() => {
    if (isRunning) {
      // タイマーが開始された時間から現在のelapsedTimeを引いてオフセットを計算
      const startTime = Date.now() - elapsedTime;
      // 1秒ごとに経過時間を更新するインターバルを設定
      timerIdRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000); // 1秒 = 1000ミリ秒
    } else {
      // isRunningがfalseになったらタイマーを停止
      clearInterval(timerIdRef.current);
    }

    // クリーンアップ関数: コンポーネントがアンマウントされるか、
    // isRunningまたはelapsedTimeが変更されてeffectが再実行される前に、
    // 既存のタイマーをクリアする
    return () => clearInterval(timerIdRef.current);
  }, [isRunning, elapsedTime]); // isRunningまたはelapsedTimeが変更されたときにeffectを再実行

  // ミリ秒を "HH:MM:SS" 形式にフォーマットする関数
  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // 数字を2桁にパディングするヘルパー関数
    const pad = (num) => num.toString().padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // スタート/ストップボタンのクリックハンドラー
  const handleStartStop = () => {
    setIsRunning(!isRunning); // isRunningの状態を反転させる
  };

  // リセットボタンのクリックハンドラー
  const handleReset = () => {
    setIsRunning(false); // タイマーを停止
    setElapsedTime(0); // 経過時間を0にリセット
    setRecords([]); // 記録リストをクリア
  };

  // 保存ボタンのクリックハンドラー
  const handleSave = () => {
    const recordTime = formatTime(elapsedTime); // 現在の経過時間をフォーマット
    // 既存の記録リストに新しい記録を追加
    setRecords((prevRecords) => [...prevRecords, recordTime]);
  };

  return (
    <div className="stopwatch-container">
      <h1>ストップウォッチ</h1>
      {/* 経過時間を表示 */}
      <div id="display" className="display">
        {formatTime(elapsedTime)}
      </div>
      <div className="controls">
        {/* スタート/ストップボタン */}
        <button id="startStopBtn" onClick={handleStartStop}>
          {isRunning ? "ストップ" : "スタート"}{" "}
          {/* isRunningの状態によってボタンのテキストを変更 */}
        </button>
        {/* リセットボタン */}
        <button id="resetBtn" onClick={handleReset}>
          リセット
        </button>
        {/* 保存ボタン */}
        <button id="saveBtn" onClick={handleSave}>
          保存
        </button>
      </div>
      <div className="records-container">
        <h2>記録</h2>
        <ul id="recordList">
          {/* 保存された記録をリスト表示 */}
          {records.map((record, index) => (
            <li key={index}>記録: {record}</li> // 各記録に一意のkeyを与える
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Stopwatch;
