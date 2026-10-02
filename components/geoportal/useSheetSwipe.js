import { useRef, useState } from "react";

export default function useSheetSwipe(onClose, enabled = true) {
  const startY = useRef(null);
  const [offset, setOffset] = useState(0);

  const onTouchStart = (event) => {
    if (!enabled || event.touches.length !== 1) return;
    startY.current = event.touches[0].clientY;
  };

  const onTouchMove = (event) => {
    if (startY.current == null || event.touches.length !== 1) return;
    const delta = event.touches[0].clientY - startY.current;
    if (delta > 0) {
      setOffset(Math.min(delta, 180));
    }
  };

  const onTouchEnd = () => {
    if (startY.current == null) return;
    const shouldClose = offset >= 72;
    startY.current = null;
    setOffset(0);
    if (shouldClose) onClose?.();
  };

  return {
    swipeHandlers: enabled
      ? { onTouchStart, onTouchMove, onTouchEnd }
      : {},
    swipeStyle: enabled && offset > 0
      ? { transform: `translate3d(0, ${offset}px, 0)`, transition: "none" }
      : undefined,
    isSwiping: offset > 0
  };
}
