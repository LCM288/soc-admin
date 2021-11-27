import { DateTime } from "luxon";
import { useContext, useMemo, useEffect } from "react";
import { TimerContext } from "pages/_app";

export const useLogoutTime = (): DateTime => {
  const { get: getLogoutTime } = useContext(TimerContext);
  return getLogoutTime();
};

export const useSetLogoutTime = (exp: number): void => {
  const { get: getLogoutTime, set: setLogoutTime } = useContext(TimerContext);
  const logoutTime = getLogoutTime();
  const newLogoutTime = useMemo(
    () =>
      exp === -1
        ? DateTime.invalid("Invalid timestamp")
        : DateTime.fromMillis(exp * 1000),
    [exp]
  );
  useEffect(() => {
    if (logoutTime !== newLogoutTime) {
      setLogoutTime(newLogoutTime);
    }
  }, [logoutTime, setLogoutTime, newLogoutTime]);
};
