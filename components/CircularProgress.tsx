import { useEffect, useRef, useState } from "react";
import Svg, { Circle } from "react-native-svg";

const DURATION = 900;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

interface Props {
  size: number;
  thickness: number;
  progress: number;
  color: string;
  unfilledColor: string;
}

export default function CircularProgress({ size, thickness, progress, color, unfilledColor }: Props) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const target = Math.min(Math.max(progress, 0), 1);

    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      setDisplayed(easeOutCubic(t) * target);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [progress]);

  const center = size / 2;
  const radius = center - thickness / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - displayed);

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} stroke={unfilledColor} strokeWidth={thickness} fill="none" />
      <Circle
        cx={center} cy={center} r={radius}
        stroke={color} strokeWidth={thickness} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90, ${center}, ${center})`}
      />
    </Svg>
  );
}
