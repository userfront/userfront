import { useState, useLayoutEffect } from "react";
import useResizeObserver from "@react-hook/resize-observer";

export const useSizeClass = (target) => {
  const [size, setSize] = useState();

  useLayoutEffect(() => {
    target && setSize(target.getBoundingClientRect().width);
  }, [target]);

  useResizeObserver(target, (entry) => {
    setSize(entry.contentRect.width);
  });

  if (size <= 250) {
    return "userfront-tiny";
  }
  if (size <= 350) {
    return "userfront-small";
  }
  if (size <= 500) {
    return "userfront-medium";
  }
  return "userfront-large";
};
