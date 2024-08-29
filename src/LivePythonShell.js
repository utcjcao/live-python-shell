import React, { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/python/python"; // Import the Python mode

const LivePythonShell = () => {
  const [socket, setSocket] = useState();
  const [code, setCode] = useState("");
  const [output, setOutput] = useState();

  const handleCodeChange = (editor, data, value) => {
    setCode(value);
    if (socket) {
      socket.emit("send-input-changes", value);
    }
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
    const handler_code = (newCode) => {
      setCode(newCode);
    };
    const handler_output = (newOutput) => {
      setOutput(newOutput);
    };
    socket.on("recieve-input-changes", handler_code);
    socket.on("recieve-output-changes", handler_output);
    return () => {
      socket.off("recieve-input-changes", handler_code);
      socket.off("recieve-output-changes", handler_output);
    };
  }, [socket]);

  useEffect(() => {});
  return (
    <>
      <div className="input-container">
        <CodeMirror
          value={code}
          options={{
            mode: "python",
            theme: "material",
            lineNumbers: true,
          }}
          onBeforeChange={handleCodeChange}
        />
        <button onClick={handleExecutionChange}>Run</button>
      </div>
      <div className="output-container">
        <pre>{output}</pre>
      </div>
    </>
  );
};

export default LivePythonShell;
