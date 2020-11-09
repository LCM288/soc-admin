import { useEffect, useContext } from "react";
import { ClipCountContext } from "pages/_app";

const useClipped = (shouldClip: boolean): void => {
  const { add, remove } = useContext(ClipCountContext);
  useEffect(() => {
    if (shouldClip) {
      add();
      return remove;
    }
    return () => {};
  });
};

export default useClipped;
