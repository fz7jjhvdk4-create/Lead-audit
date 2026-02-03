'use client';

interface RadarChartProps {
  data: {
    label: string;
    value: number;
    maxValue?: number;
  }[];
  size?: number;
  color?: string;
}

export function RadarChart({ data, size = 300, color = '#3b82f6' }: RadarChartProps) {
  const center = size / 2;
  const radius = (size - 60) / 2;
  const angleStep = (2 * Math.PI) / data.length;
  const levels = 5;

  // Filtrera bort null-värden
  const validData = data.filter(d => d.value !== null && d.value !== undefined);

  if (validData.length < 3) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-gray-500 text-sm">Otillräcklig data för diagram</p>
      </div>
    );
  }

  // Beräkna punkter för data
  const points = validData.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const maxVal = d.maxValue || 5;
    const normalizedValue = d.value / maxVal;
    const x = center + radius * normalizedValue * Math.cos(angle);
    const y = center + radius * normalizedValue * Math.sin(angle);
    return { x, y, ...d };
  });

  // Skapa polygon-sträng
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Skapa grid-linjer
  const gridLines = [];
  for (let level = 1; level <= levels; level++) {
    const levelRadius = (radius * level) / levels;
    const levelPoints = validData.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + levelRadius * Math.cos(angle);
      const y = center + levelRadius * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
    gridLines.push(levelPoints);
  }

  // Skapa axel-linjer
  const axisLines = validData.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x1: center, y1: center, x2: x, y2: y };
  });

  // Skapa etiketter
  const labels = validData.map((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const labelRadius = radius + 30;
    const x = center + labelRadius * Math.cos(angle);
    const y = center + labelRadius * Math.sin(angle);
    return { x, y, label: d.label, value: d.value };
  });

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridLines.map((points, i) => (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="1"
            className="text-gray-200 dark:text-gray-700"
          />
        ))}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill={color}
          fillOpacity="0.25"
          stroke={color}
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={color}
          />
        ))}

        {/* Level labels (1-5) */}
        {[1, 2, 3, 4, 5].map(level => {
          const labelRadius = (radius * level) / levels;
          return (
            <text
              key={level}
              x={center + 5}
              y={center - labelRadius}
              fontSize="10"
              fill="currentColor"
              className="text-gray-400 dark:text-gray-500"
            >
              {level}
            </text>
          );
        })}
      </svg>

      {/* Labels */}
      {labels.map((l, i) => (
        <div
          key={i}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
          style={{
            left: l.x,
            top: l.y,
            maxWidth: '80px',
          }}
        >
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 leading-tight block">
            {l.label}
          </span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {l.value}
          </span>
        </div>
      ))}
    </div>
  );
}

// Alternativ: Bar chart för kompetensområden
interface BarChartProps {
  data: {
    label: string;
    value: number;
    maxValue?: number;
    description?: string;
  }[];
}

export function CompetencyBarChart({ data }: BarChartProps) {
  const validData = data.filter(d => d.value !== null && d.value !== undefined);

  const getColor = (value: number) => {
    if (value >= 4) return 'bg-green-500';
    if (value >= 3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getColorLight = (value: number) => {
    if (value >= 4) return 'bg-green-100 dark:bg-green-900/30';
    if (value >= 3) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className="space-y-4">
      {validData.map((d, i) => {
        const maxVal = d.maxValue || 5;
        const percentage = (d.value / maxVal) * 100;

        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {d.label}
              </span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded ${getColorLight(d.value)} ${d.value >= 4 ? 'text-green-700 dark:text-green-300' : d.value >= 3 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                {d.value}/{maxVal}
              </span>
            </div>
            {d.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{d.description}</p>
            )}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${getColor(d.value)} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
