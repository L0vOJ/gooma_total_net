// import logo from './logo.svg';
// import './App.css';
// import React from 'react';
// import { gql, useQuery } from '@apollo/client';
import React from 'react'; //, { useEffect, useState }
import { Entrance } from './js/frame.js'; //BaseFrame, BaseFrameSample
// import axios from 'axios';

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
  return (
    // <BaseFrame message={message} status={status}/>
    <Entrance />
  );
}
export default App;

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