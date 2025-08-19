export default function DailyTaskList() {
  const handlebutton = () => {
    alert("ボタンが押されたよ");
  };
  return (
    <div>
      <h1>一日のやることリスト</h1>
      <button onClick={handlebutton}>ボタン</button>
    </div>
  );
}

// const checkbox = document.getElementById("checkbox")
// //idが"checkbox"のタグを取得

// //checkboxを押した時の処理（checkboxが押された時に発動する）
// checkbox.onclick = function(){
//     console.log("チェックボックスが押されたよ！")//コンソールに出力
// }
