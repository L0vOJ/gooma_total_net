import { useNavigate } from 'react-router-dom'; // 혹은 Next.js의 useRouter 사용
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from './loading';

export default function Server()
{
  // const [message, setMessage] = useState(json_test_false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [list, setServerList] = useState(null);
  const [status, setServerStatus] = useState(null);
  useEffect(() => {
    // Express 서버의 API를 호출
    axios.get('/api/server/list')
      .then(response => {
        setServerList(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    axios.get('/api/server/status')
      .then(response => {
        setServerStatus(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  if (!list || !status) {
    return <div>Loading...</div>;
  }
  // handleServer 함수는 상태, 모드팩, 서버 값을 받아 API 요청을 보냅니다.
  const handleServer = async (statusVal, modpackVal = '', serverVal = '') => {
    try {
      setLoading(true);
      // URL에 쿼리 스트링 생성 (입력값은 encodeURIComponent로 안전하게 처리)
      const url = `/api/server/control?status=${encodeURIComponent(statusVal)}&modpack=${encodeURIComponent(modpackVal)}&server=${encodeURIComponent(serverVal)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Server handle failed');
      }
      // 원하는 경우 요청 성공 후 다른 페이지로 이동
      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error('Server handle error:', err);
    }
  };
  return (
    <main style={mainStyle}>
      {loading ? <Loading /> : null}
      <div style={containerStyle}>
        <h2 style={titleStyle}>Server Status: {status.output}</h2>
        <div style={itemsContainerStyle}>
          <div style={itemBoxStyle}>
            <a style={{ cursor: "pointer" }} onClick={() => handleServer("on")}>On</a>
          </div>
          <div style={itemBoxStyle}>
            <a style={{ cursor: "pointer" }} onClick={() => handleServer("off")}>Off</a>
          </div>
        </div>
      </div>
      {Object.keys(list).map((key) => (
        <div key={key} style={containerStyle}>
          <h2 style={titleStyle}>{key}</h2>
          <div style={itemsContainerStyle}>
            {list[key].map((item, index) => (
              <div key={index} style={itemBoxStyle}>
                <a
                  style={{ cursor: "pointer" }}
                  onClick={() => handleServer("change", key, item)}
                >
                  {item}
                </a>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}

const mainStyle = {
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
};

const containerStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
  backgroundColor: '#fff',
};

const titleStyle = {
  fontSize: '1.5rem',
  marginBottom: '12px',
  borderBottom: '1px solid #eee',
  paddingBottom: '8px',
};

const itemsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
};

const itemBoxStyle = {
  backgroundColor: '#f8f8f8',
  padding: '10px 14px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  // cursor : "pointer"
};