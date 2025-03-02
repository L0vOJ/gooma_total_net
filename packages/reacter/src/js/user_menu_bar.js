import React from "react";
import { NavLink } from "react-router-dom";
import Logout from './logout.js';

export default function UserMenuBar() {
  return (
    <header style={{ background: "#38c9b5" }}>
      <nav style={{ padding: "1rem", background: "#454545", "borderRadius": "1.5vmin"}}>
        {/* <ul style={{ display: "flex", listStyle: "none", gap: "1rem", margin: 0 }}> */}
        <ul style={{ "textAlign": "center", listStyle: "none", gap: "1rem", margin: 0 }}>
          {/* <li>
            <NavLink 
              to="/user/option" 
              style={({ isActive }) => ({
                color: isActive ? "orange" : "white",
                textDecoration: "none",
                textAlign: "left"
              })}
            >
              설정
            </NavLink>
          </li> */}
          <li>
            <Logout/>
          </li>
        </ul>
      </nav>
    </header>
  );
}
