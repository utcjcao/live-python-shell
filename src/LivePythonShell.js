import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const LivePythonShell = () => {
  const [socket, setSocket] = useState();
  const [code, setCode] = useState();
  const [output, setOutput] = useState();

  const handleInputChange = (event) => {
    setCode(event.target.value);
    socket.emit("send-changes", event.target.value);
  };

  useEffect(() => {
    const s = io("http://localhost:5000");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  // recieve changes
  useEffect(() => {
    const handler = (newCode) => {
      setCode(newCode);
    };
    socket.on("recieve-changes", handler);
    return () => {
      socket.off("recieve-changes", handler);
    };
  }, [socket]);

  useEffect(() => {});
  return (
    <div>
      <input value={code} onChange={handleInputChange}></input>
    </div>
  );
};

export default LivePythonShell;
