import React, { useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import "./Navbar.scss";
import { StatusContext } from "../../Modules/StatusContext/StatusContext";
function Navbar() {
  const { listening, isBootloaderConnected, checkBootloaderConnection } =
    useContext(StatusContext);
  return (
    <nav>
      <ul className="navbar">
        <li>
          <span className="navbar-title">Bootloader Web Interface</span>
        </li>
        <li>
          <span
            className={`status ${listening ? "connected" : "not-connected"}`}
          >
            {listening ? "Connected" : "Not Connected"}
          </span>
        </li>
        <li>
          <span
            className={`status ${
              isBootloaderConnected ? "connected" : "not-connected"
            }`}
          >
            {isBootloaderConnected
              ? "Connected with Server"
              : "Not Connected with Server"}
          </span>
        </li>
        <li>
          <button onClick={checkBootloaderConnection}>
            Update Server Status
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
