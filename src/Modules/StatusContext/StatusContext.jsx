import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

const StatusContext = createContext();

const StatusProvider = ({ children }) => {
  const [listening, setListening] = useState(false);
  const [isBootloaderConnected, setBootloaderConnectionStatus] =
    useState(false);
  const server_url = import.meta.env.VITE_APP_API;

  const checkBootloaderConnection = () => {
    axios.get(`${server_url}/bl/status`).then((response) => {
      console.log(response);
      setBootloaderConnectionStatus(response.data.message === "Connected");
    });
  };
  useEffect(() => {
    if (!listening) {
      const events = new EventSource(`${server_url}/events`);

      events.onmessage = (event) => {
        const parsedData = JSON.parse(event.data);
        console.log(parsedData);
        if (parsedData.type === "status") {
          setBootloaderConnectionStatus(
            parsedData.data.message === "Connected"
          );
        }
      };
      events.onopen = () => {
        setListening(true);
      };
      events.onerror = () => {
        setListening(false);
        setBootloaderConnectionStatus(false);
      };
    }
  }, [listening]);
  return (
    <StatusContext.Provider
      value={{ listening, isBootloaderConnected, checkBootloaderConnection }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export { StatusContext, StatusProvider };
