import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 혹은 Next.js의 useRouter 사용
import '../css/frame.css';
// import '../css/list_box.css';
// import title from '../images/title.png';
import UserMenuBar from './user_menu_bar.js';
import LoginPage from './login.js';
// import Logout from './logout.js';
import Header from './header.js';
import { gql, useQuery } from '@apollo/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// import KeystoneRenderer from './keystone_renderer';
import CustomDocumentRenderer from './custom_renderer';
import axios from 'axios';

const GET_TEXT_POSTS = gql`
  query {
    textPosts {
      id
      title
      content
    }
  }
`;

const GET_ANNOUNCE = gql`
  query {
    announces {
      id
      title
      content {
        document
      }
    }
  }
`;

const GET_USERS = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        name
        email
      }
    }
  }
`;
        
// function Header()
// {
//   return (
//     <img src={title} className="title-logo" alt="logo" />
//   );
// }

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

function AuthenticatedUser() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  React.useEffect(() => {
    refetch(); // 메인 페이지 마운트 시 최신 인증 정보를 가져옴
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  const user = data.authenticatedItem;
  const Notch_uuid = "069a79f4-44e9-4726-a5be-fca90e38aaf5" //tmp apply -- userdata uuid add soon
  
  const HeadDisplay = (uuid, size) => (
    "https://minotar.net/avatar/" + uuid + "/" + size
  );

  // 로그인된 사용자가 없으면 null이 반환될 수 있음
  if (!data || !data.authenticatedItem) {
    return (
      <div></div>
      // <main>
      //   <div className="container" style={{ "text-align": "center" }}>
      //     <h2>-- 포스트, 공지 확인하려면 로그인이 필요합니다 --</h2>
      //     <Link to='/signin'>
      //       <button type="button" style={{ padding: '0.5rem 25%'}}>
      //         login
      //       </button>
      //     </Link>
      //   </div>
      // </main>
    );
  }
  
  return (
    <div className="service-item" style={{ width: "50vmin" }}>
      <table className="text_default" height="100%">
        <tbody>
          <tr key={user.id}>
            <td width="10%">
              <img className="head-logo" src={HeadDisplay(Notch_uuid, 100)} />
            </td>
            <td width="28%">User: {user.name ? user.name : user.email}</td>
          </tr>
        </tbody>
      </table>
      <UserMenuBar/>
    </div>
  );
}


function TailEnd()
{
  return (
    <footer>
      <div className="container">
        <p className="tail">2025 L0vOJ | All Rights Blabla Reserved? | idk how to write these things</p>
      </div>
    </footer>
  );
}

function Main()
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

function Server()
{
  // const [message, setMessage] = useState(json_test_false);
  const navigate = useNavigate();
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
      // URL에 쿼리 스트링 생성 (입력값은 encodeURIComponent로 안전하게 처리)
      const url = `/api/server/control?status=${encodeURIComponent(statusVal)}&modpack=${encodeURIComponent(modpackVal)}&server=${encodeURIComponent(serverVal)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Server handle failed');
      }
      // 원하는 경우 요청 성공 후 다른 페이지로 이동
      navigate('/');
    } catch (err) {
      console.error('Server handle error:', err);
    }
  };
  return (
    <main style={mainStyle}>
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

function TextPost()
{
  const { loading, error, data } = useQuery(GET_TEXT_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <div className="container">
        <h2>[전체 포스트 내역]</h2>
        <ul>
          {data.textPosts.map((textPost) => (
            <li key={textPost.id}>
              <h2>{textPost.title}</h2>
              <p>{textPost.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function Announce()
{
  const { loading, error, data } = useQuery(GET_ANNOUNCE);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      {data.announces.map((announce) => (
        <main>
          <div className="container">
            <h1>{announce.title}</h1>
            <CustomDocumentRenderer document={announce.content.document} />
          </div>
        </main>
      ))}
    </div>
    // {data.announces.map((announce) => (
    //   <KeystoneRenderer document={announce.content.document} />
    // ))} 
  );
}

function NotFound()
{
  return (
    <main>
      <div className="container">
        <h2 className="tail">404 not found</h2>
      </div>
    </main>
  );
}

export function Entrance()
{
  const { loading, error, data, refetch } = useQuery(GET_USERS);

  React.useEffect(() => {
    refetch(); // 메인 페이지 마운트 시 최신 인증 정보를 가져옴
  }, [refetch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  //basename="/main": React 라우터가 /main을 기준으로 동작하도록 설정.
  if (!data || !data.authenticatedItem) {
    return (
      <body>
        <BrowserRouter basename="/main">
          <Header />
          <AuthenticatedUser />
          <Routes>
            <Route path="/" element={<Main />}></Route>
            <Route path="/signin/*" element={<LoginPage />}></Route>
            {/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
          <TailEnd />
        </BrowserRouter>
      </body>
    );
  }
	return (
    <body>
      <BrowserRouter basename="/main">
        <Header />
        <AuthenticatedUser />
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/server/*" element={<Server />}></Route>
          <Route path="/textpost/*" element={<TextPost />}></Route>
          <Route path="/announce/*" element={<Announce />}></Route>
          <Route path="/signin/*" element={<LoginPage />}></Route>
          {/* 상단에 위치하는 라우트들의 규칙을 모두 확인, 일치하는 라우트가 없는경우 처리 */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
        <TailEnd />
      </BrowserRouter>
    </body>
  );
};



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


// export function BaseFrame({message, status})
// {
//   const { loading, error, data } = useQuery(GET_TEXT_POSTS);
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;
//   return(
//     <body>
//       {/* <!-- Header Section --> */}
//       {/* <HaderSample /> */}
//       <img src={title} className="title-logo" alt="logo" />
//       {/* <!-- Main Content Section --> */}
//       <main>
//         <div className="container">
//           <ServerStatus message={message} status={status}/>
//           {
//             status && message.online && 
//             <PlayerStatus message={message} status={status}/>
//           }
//           <h2>Posts</h2>
//           <ul>
//             {data.posts.map((post) => (
//               <li key={post.id}>
//                 <h2>{post.title}</h2>
//                 <p>{post.content}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </main>
//       {/* <!-- Footer Section --> */}
//       <footer>
//         <div className="container">
//           <p className="tail">2025 L0vOJ | All Rights Blabla Reserved?</p>
//         </div>
//       </footer>
//     </body>
//   );
// }

// function HaderSample()
// {
//   return(
//     <header>
//       <div className="container">
//         <h1>My Website</h1>
//         <nav>
//           <ul>
//             <li><a href="#">Home</a></li>
//             <li><a href="#">About</a></li>
//             <li><a href="#">Services</a></li>
//             <li><a href="#">Contact</a></li>
//           </ul>
//         </nav>
//       </div>
//     </header>
//   );
// }

// export function BaseFrameSample()
// {
//   return(
//     <body>
//       {/* <!-- Header Section --> */}
//       <header>
//         <div className="container">
//           <h1>My Website</h1>
//           <nav>
//             <ul>
//               <li><a href="#">Home</a></li>
//               <li><a href="#">About</a></li>
//               <li><a href="#">Services</a></li>
//               <li><a href="#">Contact</a></li>
//             </ul>
//           </nav>
//         </div>
//       </header>

//       {/* <!-- Main Content Section --> */}
//       <main>
//         <div className="container">
//           <section className="intro">
//             <h2>Welcome to My Website</h2>
//             <p>This is a basic template to get you started with your website.</p>
//           </section>

//           <section className="services">
//             <h2>Our Services</h2>
//             <div className="service-item">
//               <h3>Web Development</h3>
//               <p>Building responsive and modern websites.</p>
//             </div>
//             <div className="service-item">
//               <h3>UI/UX Design</h3>
//               <p>Creating user-friendly interfaces and experiences.</p>
//             </div>
//             <div className="service-item">
//               <h3>SEO Optimization</h3>
//               <p>Improving website visibility and ranking on search engines.</p>
//             </div>
//           </section>
//         </div>
//       </main>

//       {/* <!-- Footer Section --> */}
//       <footer>
//         <div className="container">
//           <p>2025 My Website | All Rights Maybe not Reserved</p>
//         </div>
//       </footer>
//     </body>
//   );
// }