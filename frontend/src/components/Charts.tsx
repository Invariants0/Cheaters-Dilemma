"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { GamePanel } from "@/components/GameUI";

interface ResourceChartProps {
  data: { turn: number; resources: number }[];
  title?: string;
  height?: number;
}

export function ResourceChart({
  data,
  title = "RESOURCE HISTORY",
  height = 250,
}: ResourceChartProps) {
  return (
    <GamePanel title={title} variant="blue">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorResources" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#eab308" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eab308" opacity={0.2} />
          <XAxis dataKey="turn" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f2e",
              border: "2px solid #eab308",
              borderRadius: 0,
              color: "#eab308",
              fontFamily: "monospace",
            }}
          />
          <Area
            type="monotone"
            dataKey="resources"
            stroke="#eab308"
            fillOpacity={1}
            fill="url(#colorResources)"
          />
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

export function TrustChart({
  data,
  title = "TRUST TIMELINE",
  height = 250,
}: TrustChartProps) {
  return (
    <GamePanel title={title} variant="green">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#16a34a" opacity={0.2} />
          <XAxis dataKey="turn" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            domain={[0, 1]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f2e",
              border: "2px solid #16a34a",
              borderRadius: 0,
              color: "#16a34a",
              fontFamily: "monospace",
            }}
          />
          <Line
            type="monotone"
            dataKey="trust"
            stroke="#16a34a"
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

export function MetricsChart({
  data,
  title = "METRICS",
  height = 250,
}: MetricsChartProps) {
  return (
    <GamePanel title={title} variant="red">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dc2626" opacity={0.2} />
          <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f2e",
              border: "2px solid #dc2626",
              borderRadius: 0,
              color: "#dc2626",
              fontFamily: "monospace",
            }}
          />
          <Bar dataKey="value" fill="#dc2626" isAnimationActive={false} />
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

export function ActionDistribution({
  data,
  title = "ACTION DISTRIBUTION",
  height = 250,
}: ActionDistributionProps) {
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <GamePanel title={title}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eab308" opacity={0.2} />
          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            style={{ fontSize: "12px" }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1a1f2e",
              border: "2px solid #eab308",
              borderRadius: 0,
              color: "#eab308",
              fontFamily: "monospace",
            }}
          />
          <Bar dataKey="value" fill="#eab308" isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </GamePanel>
  );
}

