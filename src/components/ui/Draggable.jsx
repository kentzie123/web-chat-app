import { useRef, useState, useLayoutEffect } from "react";
import { useDrag } from "@use-gesture/react";

export default function DraggableVideo({ children }) {
  const ref = useRef(null);
  const parentRef = useRef(null);

  const [bounds, setBounds] = useState({ maxX: 0, maxY: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Measure bounds and set initial bottom-right position
  useLayoutEffect(() => {
    if (ref.current && ref.current.parentElement) {
      parentRef.current = ref.current.parentElement;

      const updateBounds = () => {
        const parentRect = parentRef.current.getBoundingClientRect();
        const childRect = ref.current.getBoundingClientRect();
        const maxX = parentRect.width - childRect.width;
        const maxY = parentRect.height - childRect.height;

        setBounds({ maxX, maxY });
        // Set initial position to bottom-right
        setPosition({ x: maxX, y: maxY });
      };

      updateBounds();
      window.addEventListener("resize", updateBounds);
      return () => window.removeEventListener("resize", updateBounds);
    }
  }, []);

  useDrag(
    ({ offset: [x, y] }) => {
      const clampedX = Math.max(0, Math.min(x, bounds.maxX));
      const clampedY = Math.max(0, Math.min(y, bounds.maxY));
      setPosition({ x: clampedX, y: clampedY });
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
