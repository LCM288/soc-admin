import { useEffect } from "react";

const useClipped = (shouldClip: boolean): void => {
  useEffect(() => {
    if (shouldClip) {
      document.scrollingElement?.classList.add("is-clipped");
    } else {
      document.scrollingElement?.classList.remove("is-clipped");
    }
  }, [shouldClip]);
};

export default useClipped;
