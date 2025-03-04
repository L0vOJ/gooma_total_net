import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/frame.css';
// import Loading from './loading';

const json_test_false = {
  online: false,
  host: 'not found',
  port: 25565,
  ip_address: '1.1.1.1',
};

const json_test_true = {
  online: true,
  host: 'blabla',
  port: 25565,
  ip_address: '1.2.3.4',
  motd: {
    raw: 'test',
    clean: 'test',
    html: '<span><span>test</span></span>'
  },
  players: { online: 2, max: 20, list: [ 
    {
      "uuid": "398a6080-9fd5-44ed-ad30-0072d5efdf10",
      "name_clean": "L0vOJ",
    },
    {
      "uuid": "069a79f4-44e9-4726-a5be-fca90e38aaf5",
      "name_clean": "Notch",
    }
  ] },
};

export default function Main()
{
  const [message, setMessage] = useState(json_test_false);
  const [status, setstatus] = useState(false);
  useEffect(() => {
    // Express 서버의 API를 호출
    axios.get('/api/mcs')
      .then(response => {
        setstatus(true);
        setMessage(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  return (
    <main>
      <div className="container">
        <ServerStatus message={message} status={status}/>
        {
          status && message.online && 
          <PlayerStatus message={message} status={status}/>
        }
      </div>
    </main>
  );
}

function ServerStatus({message, status})
{
  const url = "https://netgooma.ddns.net";
  const dynmap_link = url + "/map";
  return(
    <section className="intro">
      {
        status 
        ? message.online
          ? <h2 className="text_default">현재 서버:&ensp;
              <Link to={dynmap_link}>
                {message.motd.clean}  
              </Link>
            </h2>
          : <h2 className="text_default">현재 서버: 작동 중지 <br></br>-- 관리자에게 문의 바랍니다 --</h2> 
        : <h2 className="text_default">로딩 중... </h2>
      }
    </section>
  );
}

function PlayerStatus({message, status})
{
  const HeadDisplay = (uuid, size) => (
    "https://minotar.net/avatar/" + uuid + "/" + size
  );
  const PlayerInfo = (item, index) => (
    <div className="service-item">
      <table className="text_default" height="100%">
        <tr>
          <td width="20%">
            <img className="head-logo" src={HeadDisplay(item.uuid, 100)} />
          </td>
          <td width="28%"> {item.name_clean}</td>
        </tr>
      </table>
    </div>
  );
  return(
    <section className="services">
      <h2 className="text_default">Players: {message.players.online}</h2>
      {message.players.list.map(PlayerInfo)}
    </section>
  );
}