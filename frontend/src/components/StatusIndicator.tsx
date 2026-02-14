"use client";

import { useEffect, useRef, useState } from "react";
import { getSimulationHealthSocketUrl } from "@/lib/ws";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface HealthSocketMessage {
  type: string;
  tick?: number;
  timestamp?: string;
}

export function StatusIndicator() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const reconnectTimerRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const socketUrl = getSimulationHealthSocketUrl();

  useEffect(() => {
    let isCancelled = false;

    const connect = () => {
      if (isCancelled) return;
      setStatus("connecting");

      const socket = new WebSocket(socketUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isCancelled) return;
        setStatus("connected");
      };

      socket.onmessage = () => {
        // Just keep alive
      };

      socket.onerror = () => {
        if (isCancelled) return;
        setStatus("error");
      };

      socket.onclose = () => {
        if (isCancelled) return;
        setStatus("disconnected");
        reconnectTimerRef.current = window.setTimeout(connect, 2500);
      };
    };

    connect();

    return () => {
      isCancelled = true;
      if (reconnectTimerRef.current !== null) {
        window.clearTimeout(reconnectTimerRef.current);
      }
      if (socketRef.current && socketRef.current.readyState <= WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [socketUrl]);

  const statusText = status === "connected" ? "ONLINE" : status === "connecting" ? "CONNECTING" : "OFFLINE";
  const statusColor = status === "connected" ? "text-green-400" : status === "connecting" ? "text-yellow-500" : "text-red-500";

  return (
    <div>
      <span className="text-slate-300">&gt; STATUS:</span>{" "}
      <span className={`${statusColor} animate-pulse`}>{statusText}</span>
    </div>
  );
}