import { cn } from "@/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface KPICardProps {
  title: string;
  value: number | string;
  trend?: "up" | "down" | "neutral";
  trendPercent?: number;
  sparklineData?: number[];
  icon?: React.ElementType;
  color?: "blue" | "green" | "amber" | "red" | "purple" | "cyan";
  suffix?: string;
  prefix?: string;
  animate?: boolean;
  "data-ocid"?: string;
}

const COLOR_MAP = {
  blue: {
    bg: "bg-primary/10",
    icon: "text-primary",
    line: "oklch(0.65 0.22 261)",
    border: "border-primary/20",
  },
  green: {
    bg: "bg-[oklch(0.58_0.18_142)]/10",
    icon: "text-[oklch(0.58_0.18_142)]",
    line: "oklch(0.58 0.18 142)",
    border: "border-[oklch(0.58_0.18_142)]/20",
  },
  amber: {
    bg: "bg-[oklch(0.72_0.18_64)]/10",
    icon: "text-[oklch(0.72_0.18_64)]",
    line: "oklch(0.72 0.18 64)",
    border: "border-[oklch(0.72_0.18_64)]/20",
  },
  red: {
    bg: "bg-destructive/10",
    icon: "text-destructive",
    line: "oklch(0.55 0.22 25)",
    border: "border-destructive/20",
  },
  purple: {
    bg: "bg-[oklch(0.55_0.20_280)]/10",
    icon: "text-[oklch(0.55_0.20_280)]",
    line: "oklch(0.55 0.20 280)",
    border: "border-[oklch(0.55_0.20_280)]/20",
  },
  cyan: {
    bg: "bg-[oklch(0.60_0.16_200)]/10",
    icon: "text-[oklch(0.60_0.16_200)]",
    line: "oklch(0.60 0.16 200)",
    border: "border-[oklch(0.60_0.16_200)]/20",
  },
};

function useAnimatedCounter(
  target: number,
  duration = 1200,
  enabled = true,
): number {
  const [current, setCurrent] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled || typeof target !== "number") {
      setCurrent(target);
      return;
    }
    const start = performance.now();
    const initial = 0;

    function step(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - (1 - progress) ** 3;
      setCurrent(Math.round(initial + (target - initial) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration, enabled]);

  return current;
}

const sparklineDataTransform = (data: number[]) =>
  data.map((v, i) => ({ i, v }));

export default function KPICard({
  title,
  value,
  trend = "neutral",
  trendPercent,
  sparklineData = [],
  icon: Icon,
  color = "blue",
  suffix = "",
  prefix = "",
  animate = true,
  "data-ocid": dataOcid,
}: KPICardProps) {
  const colors = COLOR_MAP[color];
  const numericValue =
    typeof value === "number" ? value : Number.parseFloat(String(value)) || 0;
  const animated = useAnimatedCounter(
    numericValue,
    1200,
    animate && typeof value === "number",
  );
  const displayValue = typeof value === "number" ? animated : value;
  const chartData = sparklineDataTransform(
    sparklineData.length ? sparklineData : [0, 0],
  );

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendClass =
    trend === "up"
      ? "text-[oklch(0.58_0.18_142)]"
      : trend === "down"
        ? "text-destructive"
        : "text-muted-foreground";

  return (
    <div
      data-ocid={dataOcid}
      className={cn(
        "kpi-card hover:shadow-md hover:-translate-y-0.5 cursor-default",
        "border",
        colors.border,
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">
          {title}
        </p>
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              colors.bg,
            )}
          >
            <Icon size={15} className={colors.icon} />
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <p className="text-2xl font-bold text-foreground font-display leading-none">
            {prefix}
            {displayValue}
            {suffix}
          </p>
          {trendPercent !== undefined && (
            <div className={cn("flex items-center gap-1 mt-1.5", trendClass)}>
              <TrendIcon size={13} />
              <span className="text-xs font-medium">
                {Math.abs(trendPercent)}% vs last month
              </span>
            </div>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData.length > 1 && (
          <div className="w-20 h-10 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke={colors.line}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={animate}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-popover border border-border rounded px-2 py-1 text-[10px] text-popover-foreground shadow-md">
                        {payload[0]?.value}
                      </div>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
