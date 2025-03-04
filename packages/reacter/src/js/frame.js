import React from 'react'; //, { useEffect, useState }

import '../css/frame.css';
// import '../css/list_box.css';
import UserMenuBar from './user_menu_bar.js';
import LoginPage from './login.js';
import Header from './header.js';
import Server from './server.js';
import Main from './main.js';
import { gql, useQuery } from '@apollo/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomDocumentRenderer from './custom_renderer';
// import axios from 'axios';

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
    <div className="service-item">
      <table className="text_default" height="100%">
        <tbody>
          <tr key={user.id}>
            <td width="10%">
              <img className="head-logo" src={HeadDisplay(Notch_uuid, 100)} />
            </td>
            <td width="16%">User: {user.name ? user.name : user.email}</td>
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

function TextPost()
{
  const { loading, error, data } = useQuery(GET_TEXT_POSTS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <div className="container">
        <h1 className="text_default">[전체 포스트 내역]</h1>
        <ul>
          {data.textPosts.map((textPost) => (
            <li key={textPost.id} className="text_document">
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
            <h1 className="text_default">{announce.title}</h1>
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