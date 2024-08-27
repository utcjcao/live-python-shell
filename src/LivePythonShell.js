import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";

const LivePythonShell = () => {
  const [socket, setSocket] = useState();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState();

  const handleInputChange = (event) => {
    setCode(event.target.value);
    socket.emit("send-input-changes", event.target.value);
  };

  const handleExecutionChange = () => {
    socket.emit("execute-code", code);
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
    if (socket == null) return;
    const handler = (newCode) => {
      setCode(newCode);
    };
    socket.on("recieve-input-changes", handler);
    return () => {
      socket.off("recieve-input-changes", handler);
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) return;
    const handler = (newOutput) => {
      setOutput(newOutput);
    };
    socket.on("recieve-output-changes", handler);
    return () => {
      socket.off("recieve-output-changes", handler);
    };
  }, [socket]);

  useEffect(() => {});
  return (
    <>
      <div className="input-container">
        <textarea
          className="input-box"
          value={code}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={handleExecutionChange}>Run</button>
      </div>
      <div className="output-container">
        <p>{output}</p>
      </div>
    </>
  );
};

export default LivePythonShell;
