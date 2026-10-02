import { useEffect, useState } from "react";

export default function useSheetPresence(open, duration = 240) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    let frameId;
    let timerId;

    if (open) {
      setRendered(true);
      frameId = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    } else {
      setVisible(false);
      timerId = window.setTimeout(() => {
        setRendered(false);
      }, duration);
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [open, duration]);

  return { rendered, visible };
}
