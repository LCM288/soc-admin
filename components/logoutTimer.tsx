import React, { useState, useEffect } from "react";
import printf from "printf";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

interface Props {
  time: DateTime;
}

const LogoutTimer: React.FunctionComponent<Props> = ({ time }: Props) => {
  const [now, setNow] = useState(DateTime.local());
  const router = useRouter();

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
  const { minutes, seconds } = time.diff(now, [
    "minutes",
    "seconds",
    "milliseconds",
  ]);

  return <div>{printf("%02d:%02d", minutes, seconds)}</div>;
};

export default LogoutTimer;
