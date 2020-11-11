import React, { useState, useEffect, useMemo } from "react";
import printf from "printf";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

interface Props {
  time: DateTime;
}

const LogoutTimer: React.FunctionComponent<Props> = ({ time }: Props) => {
  const router = useRouter();

  const [now, setNow] = useState(DateTime.local());

  useEffect(() => {
    const { millisecond } = DateTime.local();
    const disposable = setTimeout(() => {
      setNow(DateTime.local());
    }, 1000 - millisecond);
    return () => {
      clearTimeout(disposable);
    };
  });

  useEffect(() => {
    if (time < now) {
      router.push("/");
    }
  });

  // drop milliseconds
  const { minutes, seconds } = useMemo(
    () => time.diff(now, ["minutes", "seconds", "milliseconds"]),
    [time, now]
  );

  return <div>{printf("%02d:%02d", minutes, seconds)}</div>;
};

export default LogoutTimer;
