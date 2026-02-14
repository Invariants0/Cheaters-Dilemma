"use client";

import { useEffect, useRef, useState } from "react";
import { getSimulationHealthSocketUrl } from "@/lib/ws";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

interface HealthSocketMessage {
  type: string;
  tick?: number;
  timestamp?: string;
}

export function LandingSocketStatus() {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [heartbeatCount, setHeartbeatCount] = useState(0);
  const [lastHeartbeatAt, setLastHeartbeatAt] = useState<string>("--");
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

      socket.onmessage = (event) => {
        if (isCancelled) return;
        try {
          const message = JSON.parse(event.data) as HealthSocketMessage;
          if (message.type === "heartbeat") {
            setHeartbeatCount((prev) => prev + 1);
            if (message.timestamp) {
              const date = new Date(message.timestamp);
              setLastHeartbeatAt(date.toLocaleTimeString());
            }
          }
        } catch {
          // Ignore malformed payloads and keep socket alive.
        }
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

  const statusColor =
    status === "connected"
      ? "text-green-400 border-green-600"
      : status === "connecting"
        ? "text-yellow-500 border-yellow-600"
        : "text-red-500 border-red-600";

  return (
    <div className="space-y-3 text-xs font-mono">
      <div className="flex items-center justify-between">
        <span className="text-slate-400">SOCKET LINK</span>
        <span className={`px-2 py-1 border rounded-sm ${statusColor}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="border border-slate-700 bg-slate-900 p-2 rounded-sm">
          <div className="text-yellow-500">HEARTBEATS</div>
          <div className="text-slate-300 text-lg">{heartbeatCount}</div>
        </div>
        <div className="border border-slate-700 bg-slate-900 p-2 rounded-sm">
          <div className="text-yellow-500">LAST PULSE</div>
          <div className="text-slate-300 text-sm">{lastHeartbeatAt}</div>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 opacity-70 break-all">
        {socketUrl || "Preparing..."}
      </div>
    </div>
  );
}

