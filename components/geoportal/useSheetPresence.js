import { useEffect, useState } from "react";

export default function useSheetPresence(open, duration = 240) {
  const [rendered, setRendered] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    let frameId = 0;
    let timerId = 0;

    if (open) {
      frameId = window.requestAnimationFrame(() => {
        setRendered(true);
        window.requestAnimationFrame(() => setVisible(true));
      });
    } else {
      frameId = window.requestAnimationFrame(() => setVisible(false));
      timerId = window.setTimeout(() => setRendered(false), duration);
    }

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (timerId) window.clearTimeout(timerId);
    };
  }, [open, duration]);

  return { rendered, visible };
}
