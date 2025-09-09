import React from "react";
import { Link } from "react-router"; // Linkコンポーネントをインポート


function App() {
  return (
    <div className="App" style={{ 
        textAlign: 'center', 
        padding: '50px', 
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
      <h1>ようこそ！</h1>
      <p>これは最初のページです。</p>
      <div style={{ margin: '20px 0', display: 'flex', gap: '20px' }}>
        {/* タイムラインページへのリンク */}
        <Link 
          to="/timeline" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '1.2em',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#45a049'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#4CAF50'}
        >
          タイムライン
        </Link>
        {/* ストップウォッチページへのリンクを追加 */}
        <Link 
          to="/stopwatch" 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            textDecoration: 'none', 
            borderRadius: '5px',
            fontSize: '1.2em',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e88e5'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#2196F3'}
        >
          ストップウォッチ
        </Link>
      </div>
    </div>
  );
}

export default App;
