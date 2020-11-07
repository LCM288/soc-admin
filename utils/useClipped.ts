import { useEffect, useContext, useRef } from "react";
import { ClipCountContext } from "pages/_app";

const useClipped = (shouldClip: boolean): void => {
  const last = useRef(shouldClip);
  const { count, add, remove } = useContext(ClipCountContext);
  useEffect(() => {
    if (last.current === shouldClip) {
      return;
    }
    last.current = shouldClip;
    if (shouldClip) {
      if (!count) {
        document.scrollingElement?.classList.add("is-clipped");
      }
      add();
    } else {
      if (count === 1) {
        document.scrollingElement?.classList.remove("is-clipped");
      }
      remove();
    }
  }, [shouldClip, count, add, remove, last]);
};

export default useClipped;
