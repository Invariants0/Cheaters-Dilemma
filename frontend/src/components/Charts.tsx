"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { GamePanel } from "@/components/GameUI";

interface ResourceChartProps {
  data: { turn: number; resources: number }[];
  title?: string;
  height?: number;
}

export function ResourceChart({ data, title = "RESOURCE HISTORY", height = 250 }: ResourceChartProps) {
  return (
    <GamePanel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ffff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ff00ff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ffff" opacity={0.2} />
          <XAxis dataKey="turn" stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <YAxis stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f1629",
              border: "2px solid #00ffff",
              borderRadius: 0,
              color: "#00ffff",
              fontFamily: "monospace",
            }}
          />
          <Area type="monotone" dataKey="resources" stroke="#00ffff" fillOpacity={1} fill="url(#colorResources)" />
        </AreaChart>
      </ResponsiveContainer>
    </GamePanel>
  );
}

interface TrustChartProps {
  data: { turn: number; trust: number }[];
  title?: string;
  height?: number;
}

export function TrustChart({ data, title = "TRUST TIMELINE", height = 250 }: TrustChartProps) {
  return (
    <GamePanel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ffff" opacity={0.2} />
          <XAxis dataKey="turn" stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <YAxis stroke="#00d9ff" style={{ fontSize: "12px" }} domain={[0, 1]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f1629",
              border: "2px solid #00d9ff",
              borderRadius: 0,
              color: "#00d9ff",
              fontFamily: "monospace",
            }}
          />
          <Line
            type="monotone"
            dataKey="trust"
            stroke="#00d9ff"
            dot={false}
            isAnimationActive={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </GamePanel>
  );
}

interface MetricsChartProps {
  data: Array<{
    name: string;
    value: number;
    metric: string;
  }>;
  title?: string;
  height?: number;
}

export function MetricsChart({ data, title = "METRICS", height = 250 }: MetricsChartProps) {
  return (
    <GamePanel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ffff" opacity={0.2} />
          <XAxis dataKey="name" stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <YAxis stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f1629",
              border: "2px solid #ff00ff",
              borderRadius: 0,
              color: "#ff00ff",
              fontFamily: "monospace",
            }}
          />
          <Bar dataKey="value" fill="#ff00ff" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </GamePanel>
  );
}

interface ActionDistributionProps {
  data: Record<string, number>;
  title?: string;
  height?: number;
}

export function ActionDistribution({ data, title = "ACTION DISTRIBUTION", height = 250 }: ActionDistributionProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({ name, value }));

  return (
    <GamePanel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#00ffff" opacity={0.2} />
          <XAxis dataKey="name" stroke="#00d9ff" style={{ fontSize: "12px" }} angle={-45} textAnchor="end" height={100} />
          <YAxis stroke="#00d9ff" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f1629",
              border: "2px solid #00ffff",
              borderRadius: 0,
              color: "#00ffff",
              fontFamily: "monospace",
            }}
          />
          <Bar dataKey="value" fill="#00ffff" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </GamePanel>
  );
}
