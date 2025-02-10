import React, { useEffect, useState } from 'react';
import '../css/frame.css';
// import '../css/list_box.css';
import title from '../images/title.png';
import LoginPage from './login.js';
import { gql, useQuery } from '@apollo/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const GET_POSTS = gql`
  query {
    posts {
      id
      title
      content
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
        
function Header()
{
  return (
    <img src={title} className="title-logo" alt="logo" />
  );
}

function AuthenticatedUser() {
  const { loading, error, data } = useQuery(GET_USERS);
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
      <main>
        <div className="container" style={{ "text-align": "center" }}>
          <Link to='/signin'>
            <button type="button" style={{ padding: '0.5rem 25%'}}>
              login
            </button>
          </Link>
        </div>
      </main>
    );
  }
  
  return (
    <div class="service-item" style={{ width: "50vmin" }}>
      <table class="text_default" height="100%">
        <tr key={user.id}>
          <td width="10%">
            <img class="head-logo" src={HeadDisplay(Notch_uuid, 100)} />
          </td>
          <td width="28%">User: {user.name ? user.name : user.email}</td>
        </tr>
      </table>
    </div>
  );
}


function TailEnd()
{
  return (
    <footer>
      <div class="container">
        <p class="tail">2025 L0vOJ | All Rights Blabla Reserved?</p>
      </div>
    </footer>
  );
}

function Main({message, status})
{
  return (
    <main>
      <div class="container">
        <ServerStatus message={message} status={status}/>
        {
          status && message.online && 
          <PlayerStatus message={message} status={status}/>
        }
      </div>
    </main>
  );
}

function Product()
{
  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <div class="container">
        <h2>Posts</h2>
        <ul>
          {data.posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

function NotFound()
{
  return (
    <div class="container">
      <h2 class="tail">404 not found</h2>
    </div>
  );
}

export function Entrance({message, status})
{
  //basename="/main": React 라우터가 /main을 기준으로 동작하도록 설정.
	return (
    <body>
      <BrowserRouter basename="/main">
        <Header />
        <AuthenticatedUser />
        <Routes>
          <Route path="/" element={<Main message={message} status={status}/>}></Route>
          <Route path="/product/*" element={<Product />}></Route>
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
    <section class="intro">
      {
        status 
        ? message.online
          ? <h2 class="text_default">현재 서버:&ensp;
              <Link to={dynmap_link}>
                {message.motd.clean}  
              </Link>
            </h2>
          : <h2 class="text_default">현재 서버: 작동 중지 <br></br>-- 관리자에게 문의 바랍니다 --</h2> 
        : <h2 class="text_default">로딩 중... </h2>
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
    <div class="service-item">
      <table class="text_default" height="100%">
        <tr>
          <td width="20%">
            <img class="head-logo" src={HeadDisplay(item.uuid, 100)} />
          </td>
          <td width="28%"> {item.name_clean}</td>
        </tr>
      </table>
    </div>
  );
  return(
    <section class="services">
      <h2 class="text_default">Players: {message.players.online}</h2>
      {message.players.list.map(PlayerInfo)}
    </section>
  );
}


export function BaseFrame({message, status})
{
  const { loading, error, data } = useQuery(GET_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return(
    <body>
      {/* <!-- Header Section --> */}
      {/* <HaderSample /> */}
      <img src={title} className="title-logo" alt="logo" />
      {/* <!-- Main Content Section --> */}
      <main>
        <div class="container">
          <ServerStatus message={message} status={status}/>
          {
            status && message.online && 
            <PlayerStatus message={message} status={status}/>
          }
          <h2>Posts</h2>
          <ul>
            {data.posts.map((post) => (
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
              </li>
            ))}
          </ul>
        </div>
      </main>
      {/* <!-- Footer Section --> */}
      <footer>
        <div class="container">
          <p class="tail">2025 L0vOJ | All Rights Blabla Reserved?</p>
        </div>
      </footer>
    </body>
  );
}

function HaderSample()
{
  return(
    <header>
      <div class="container">
        <h1>My Website</h1>
        <nav>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function BaseFrameSample()
{
  return(
    <body>
      {/* <!-- Header Section --> */}
      <header>
        <div class="container">
          <h1>My Website</h1>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* <!-- Main Content Section --> */}
      <main>
        <div class="container">
          <section class="intro">
            <h2>Welcome to My Website</h2>
            <p>This is a basic template to get you started with your website.</p>
          </section>

          <section class="services">
            <h2>Our Services</h2>
            <div class="service-item">
              <h3>Web Development</h3>
              <p>Building responsive and modern websites.</p>
            </div>
            <div class="service-item">
              <h3>UI/UX Design</h3>
              <p>Creating user-friendly interfaces and experiences.</p>
            </div>
            <div class="service-item">
              <h3>SEO Optimization</h3>
              <p>Improving website visibility and ranking on search engines.</p>
            </div>
          </section>
        </div>
      </main>

      {/* <!-- Footer Section --> */}
      <footer>
        <div class="container">
          <p>2025 My Website | All Rights Maybe not Reserved</p>
        </div>
      </footer>
    </body>
  );
}