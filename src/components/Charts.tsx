import React, { useState } from 'react';

export interface LineChartPoint {
  label: string;
  value: number;
  unit?: string;
}

interface EvolutionLineChartProps {
  points: LineChartPoint[];
  color?: string;
  unit?: string;
  height?: number;
}

export const EvolutionLineChart: React.FC<EvolutionLineChartProps> = ({
  points,
  color = '#059669',
  unit = '',
  height = 190,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(Math.max(0, points.length - 1));

  if (points.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-sm text-[#4A635D]">
        Sem registos suficientes para gerar gráfico.
      </div>
    );
  }

  const width = 520;
  const padX = 36;
  const padTop = 26;
  const padBottom = 34;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;

  const values = points.map((p) => p.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const padding = rawMax === rawMin ? 2 : (rawMax - rawMin) * 0.2;
  const minVal = rawMin - padding;
  const maxVal = rawMax + padding;
  const range = maxVal - minVal || 1;

  const coords = points.map((p, idx) => {
    const x =
      points.length === 1
        ? padX + innerW / 2
        : padX + (idx / (points.length - 1)) * innerW;
    const y = padTop + innerH - ((p.value - minVal) / range) * innerH;
    return { x, y, ...p };
  });

  const linePath = coords
    .map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
    .join(' ');

  const areaPath =
    coords.length > 1
      ? `${linePath} L ${coords[coords.length - 1].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`
      : '';

  const safeIdx = Math.min(activeIndex, coords.length - 1);
  const activePoint = coords[safeIdx];

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-medium text-[#4A635D]">{activePoint.label}</span>
        <span className="text-lg font-bold font-mono tabular-nums text-[#062C24]">
          {activePoint.value.toFixed(1)} {unit}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
        role="img"
        aria-label="Gráfico de evolução física"
      >
        <defs>
          <linearGradient id={`area-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((t, i) => {
          const y = padTop + innerH * t;
          const labelVal = maxVal - range * t;
          return (
            <g key={i}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="#E2EAE7"
                strokeDasharray="3 3"
              />
              <text
                x={padX - 6}
                y={y + 4}
                textAnchor="end"
                className="fill-[#6D857E] text-[10px] font-mono tabular-nums"
              >
                {labelVal.toFixed(0)}
              </text>
            </g>
          );
        })}

        {areaPath && (
          <path d={areaPath} fill={`url(#area-${color.replace('#', '')})`} />
        )}

        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {coords.map((c, idx) => {
          const isActive = idx === safeIdx;
          return (
            <g
              key={idx}
              className="cursor-pointer"
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <circle cx={c.x} cy={c.y} r="18" fill="transparent" />
              <circle
                cx={c.x}
                cy={c.y}
                r={isActive ? 6 : 4}
                fill={isActive ? '#84CC16' : '#FFFFFF'}
                stroke={isActive ? '#062C24' : color}
                strokeWidth={isActive ? 2.5 : 2.5}
              />
              <text
                x={c.x}
                y={height - 8}
                textAnchor="middle"
                className={`text-[11px] font-medium ${
                  isActive ? 'fill-[#062C24] font-semibold' : 'fill-[#6D857E]'
                }`}
              >
                {c.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export interface BarChartDatum {
  label: string;
  value: number;
  highlight?: boolean;
}

export const SimpleBarChart: React.FC<{
  data: BarChartDatum[];
  formatValue?: (v: number) => string;
  height?: number;
}> = ({ data, formatValue = (v) => String(v), height = 180 }) => {
  const [selected, setSelected] = useState<number>(Math.max(0, data.length - 1));
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const active = data[Math.min(selected, data.length - 1)];

  return (
    <div className="w-full">
      {active && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-[#4A635D]">{active.label}</span>
          <span className="text-sm font-bold font-mono tabular-nums text-[#062C24]">
            {formatValue(active.value)}
          </span>
        </div>
      )}
      <div
        className="flex items-end justify-between gap-2 pt-4"
        style={{ height: `${height}px` }}
      >
        {data.map((item, idx) => {
          const pct = Math.max(10, Math.round((item.value / maxVal) * 100));
          const isSelected = idx === selected;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setSelected(idx)}
              className="flex-1 h-full flex flex-col items-center justify-end gap-2 group focus-visible:outline-2 focus-visible:outline-[#059669] rounded-lg"
            >
              <div className="w-full flex-1 flex items-end justify-center">
                <div
                  className={`w-full max-w-[38px] rounded-t-xl transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#062C24]'
                      : item.highlight
                      ? 'bg-[#059669]'
                      : 'bg-[#CFE0DA] group-hover:bg-[#10B981]'
                  }`}
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isSelected ? 'text-[#062C24] font-semibold' : 'text-[#6D857E]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ProgressRing: React.FC<{
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}> = ({ percent, size = 64, strokeWidth = 6, label }) => {
  const clamped = Math.max(0, Math.min(100, percent));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4ECE9"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#84CC16"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold font-mono tabular-nums text-[#062C24]">
        {label ?? `${clamped}%`}
      </span>
    </div>
  );
};
