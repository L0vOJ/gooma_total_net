import React from "react";
import title from '../images/title.png';
import { NavLink } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ background: "#282c34" }}>
      <img src={title} style={{ "height": "30vmin", "pointer-events": "none", "border-radius": "3vmin" }} alt="logo" />
      <nav style={{ padding: "1rem", background: "#454545", "border-radius": "1.5vmin"}}>
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
    </header>
  );
}
