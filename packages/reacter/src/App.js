// import logo from './logo.svg';
// import './App.css';
// import React from 'react';
import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { BaseFrame, Entrance, BaseFrameSample } from './js/frame.js';
import axios from 'axios';

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

// const GET_POSTS = gql`
//   query {
//     posts {
//       id
//       title
//       content
//     }
//   }
// `;

function App() {
  // const { loading, error, data } = useQuery(GET_POSTS);
  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;
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
    // <BaseFrame message={message} status={status}/>
    <Entrance message={message} status={status}/>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //     <h1>Posts</h1>
    //     <ul>
    //       {data.posts.map((post) => (
    //         <li key={post.id}>
    //           <h2>{post.title}</h2>
    //           <p>{post.content}</p>
    //         </li>
    //       ))}
    //     </ul>
    //   </header>
    // </div>
  );
}

export default App;
