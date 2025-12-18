import "./Terminal.scss";
import { useState, useEffect, useRef } from "react";

const Terminal = () => {
  const MAX_HISTORY_LENGTH = 30;
  const [history, setHistory] = useState([
    { type: "system", content: "> INITIALIZING_UPLINK..." },
    { type: "system", content: "> CONNECTING_TO_NEURAL_CORE..." },
  ]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const ws = useRef(null);
  const scrollRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (messagesEndRef.current && scrollRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        if (history.length > 50) {
          setHistory((prev) => prev.slice(-50));
        }
      }
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isAiTyping]);

  const connect = () => {
    // Si ya existe y está abierto o conectando, no hacemos nada
    if (
      ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)
    )
      return;

    const apiUrl = "https://portfolio-api.ahroi.com";
    const wsUrl = apiUrl.replace(/^http/, "ws");

    console.log("Connecting to:", wsUrl);
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected!");
      setIsConnected(true);

      // FIX 1: Evitar duplicar el mensaje de conexión en el historial
      setHistory((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (
          lastMsg &&
          lastMsg.content === "> LINK_ESTABLISHED_WITH_AEGIS_CORE"
        ) {
          return prev;
        }
        return [
          ...prev,
          { type: "system", content: "> LINK_ESTABLISHED_WITH_AEGIS_CORE" },
        ];
      });

      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "token" || data.type === "ai_response") {
          setIsAiTyping(true);
          setHistory((prev) => {
            const newHistory = [...prev];
            const lastMsg = newHistory[newHistory.length - 1];

            if (lastMsg && lastMsg.type === "ai" && lastMsg.isStreaming) {
              lastMsg.content += data.content;
            } else {
              newHistory.push({
                type: "ai",
                content: data.content,
                isStreaming: true,
              });
            }
            return newHistory;
          });
        }

        if (data.type === "done") {
          setIsAiTyping(false);
          setHistory((prev) => {
            const newHistory = [...prev];
            const lastMsg = newHistory[newHistory.length - 1];
            if (lastMsg && lastMsg.type === "ai") {
              lastMsg.isStreaming = false;
            }
            return newHistory;
          });
        }

        if (data.type === "error") {
          setHistory((prev) => [
            ...prev,
            { type: "error", content: `[ERR]: ${data.message}` },
          ]);
          setIsAiTyping(false);
        }
      } catch (e) {
        console.error("Error parsing WS message:", e);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
      setIsAiTyping(false);

      // Solo intentamos reconectar si NO fue un cierre manual (controlado por el cleanup)
      reconnectTimeout.current = setTimeout(() => {
        console.log("Attempting reconnect...");
        connect();
      }, 3000);
    };

    ws.current.onerror = (err) => {
      console.error("WebSocket Error:", err);
    };
  };

  useEffect(() => {
    connect();
    inputRef.current?.focus();

    return () => {
      // FIX 2: Limpieza correcta para evitar bucles de reconexión al desmontar
      if (ws.current) {
        // Anulamos el onclose para que no dispare el setTimeout de reconexión
        ws.current.onclose = null;
        ws.current.close();
      }
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, []);

  const handleKeyDown = (e) => {
    if (isAiTyping && e.key === "Enter") {
      e.preventDefault();
      return;
    }

    if (e.key === "Enter" && input.trim()) {
      setHistory((prev) => {
        const newHistory = [...prev, { type: "user", content: input }];
        return newHistory.length > MAX_HISTORY_LENGTH
          ? newHistory.slice(-MAX_HISTORY_LENGTH)
          : newHistory;
      });

      setHistory((prev) => [
        ...prev,
        { type: "ai", content: "", isStreaming: true },
      ]);
      setIsAiTyping(true);

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "user_input", content: input }));
      } else {
        setHistory((prev) => [
          ...prev,
          { type: "error", content: "[ERR: CONNECTION_LOST_WITH_NEURAL_CORE]" },
        ]);
        setIsAiTyping(false);
      }

      setInput("");
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  };

  const handleContainerClick = () => {
    if (window.getSelection().toString().length === 0) {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="terminal-container" onClick={handleContainerClick}>
      <div className="terminal-output" ref={scrollRef}>
        {history.map((line, i) => {
          const isCriticalError = line.content.includes(
            "[ERR: CONNECTION_LOST",
          );
          return (
            <div
              key={i}
              className={`line ${line.type} ${
                isCriticalError ? "critical-error" : ""
              }`}
            >
              <div className="line-content-wrapper">
                <span className="line-content">{line.content}</span>
              </div>
              {line.type === "ai" && line.isStreaming && (
                <span className="cursor-block">█</span>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <span className={`prompt ${isConnected ? "online" : "offline"}`}>
          {isConnected ? "OP@AEGIS:~$" : "OFFLINE>"}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck="false"
          autoFocus
        />
        {!isAiTyping && <span className="cursor-block user"></span>}
      </div>
    </div>
  );
};

export default Terminal;
