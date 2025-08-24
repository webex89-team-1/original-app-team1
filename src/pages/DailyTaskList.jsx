export default function DailyTaskList() {
  const handlebutton = () => {
    alert("新しいTo doを作成するよ");
  };
  return (
    <div>
      <h1>一日のやることリスト</h1>
      <button onClick={handlebutton}>To do</button>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState([
    { id: crypto.randomUUID(), text: "メモ1" },
  ]);
}
