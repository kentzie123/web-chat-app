import { useRef, useState, useLayoutEffect } from "react";
import { useDrag } from "@use-gesture/react";

export default function DraggableVideo({ children }) {
  const ref = useRef(null);
  const parentRef = useRef(null);

  const [bounds, setBounds] = useState({ maxX: 0, maxY: 0 });
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("draggable-video-pos");
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  // Measure bounds and set initial position
  useLayoutEffect(() => {
    if (ref.current && ref.current.parentElement) {
      parentRef.current = ref.current.parentElement;

      const updateBounds = () => {
        const parentRect = parentRef.current.getBoundingClientRect();
        const childRect = ref.current.getBoundingClientRect();
        const maxX = parentRect.width - childRect.width;
        const maxY = parentRect.height - childRect.height;

        setBounds({ maxX, maxY });

        // If there's no saved position, default to bottom-right
        const saved = localStorage.getItem("draggable-video-pos");
        if (!saved) {
          const defaultPos = { x: maxX, y: maxY };
          setPosition(defaultPos);
          localStorage.setItem("draggable-video-pos", JSON.stringify(defaultPos));
        }
      };

      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  // Drag handler using movement to avoid initial jump
  useDrag(
    ({ movement: [mx, my], memo }) => {
      if (!memo) memo = position;

      const clampedX = Math.max(0, Math.min(memo.x + mx, bounds.maxX));
      const clampedY = Math.max(0, Math.min(memo.y + my, bounds.maxY));

      setPosition({ x: clampedX, y: clampedY });
      localStorage.setItem(
        "draggable-video-pos",
        JSON.stringify({ x: clampedX, y: clampedY })
      );

      return memo;
    },
    { target: ref }
  );

  return (
    <div
      ref={ref}
      className="absolute cursor-move touch-none"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
    >
      {children}
    </div>
  );
}
