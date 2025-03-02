import React from "react";
import title from '../images/title.png';
import { NavLink } from "react-router-dom";
import { gql, useQuery } from '@apollo/client';

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

function HeaderDefault()
{
  return (
    <nav style={{ padding: "1rem", background: "#454545", "borderRadius": "1.5vmin"}}>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem", margin: 0 }}>
        <li>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            홈
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/signin" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            로그인
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

function HeaderLogin()
{
  return(
    <nav style={{ padding: "1rem", background: "#454545", "borderRadius": "1.5vmin"}}>
      <ul style={{ display: "flex", listStyle: "none", gap: "1rem", margin: 0 }}>
        <li>
          <NavLink 
            to="/" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            홈
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/textpost" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            포스트
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/announce" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            공지
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/signin" 
            style={({ isActive }) => ({
              color: isActive ? "orange" : "white",
              textDecoration: "none",
            })}
          >
            로그인
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default function Header() {
  const { loading, error, data, refetch } = useQuery(GET_USERS);
  
  React.useEffect(() => {
    refetch(); // 메인 페이지 마운트 시 최신 인증 정보를 가져옴
  }, [refetch]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // 로그인된 사용자가 없으면 null이 반환될 수 있음
  if (!data || !data.authenticatedItem) {
    return (
      <header style={{ background: "#282c34" }}>
        <img src={title} style={{ "height": "30vmin", "pointerEvents": "none", "borderRadius": "3vmin" }} alt="logo" />
        <HeaderDefault/>
      </header>
    );
  }

  return (
    <header style={{ background: "#282c34" }}>
      <img src={title} style={{ "height": "30vmin", "pointerEvents": "none", "borderRadius": "3vmin" }} alt="logo" />
      <HeaderLogin/>
    </header>
  );
}
