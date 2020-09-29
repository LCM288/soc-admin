import React, { useState } from "react";
import printf from "printf";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

interface Props {
  time: DateTime;
}

const LogoutTimer: React.FunctionComponent<Props> = ({ time }: Props) => {
  const [now, setNow] = useState(DateTime.local());
  const router = useRouter();

  if (time < now) {
    router.push("/");
    return <div>00:00</div>;
  }

  // drop milliseconds
  const { minutes, seconds } = time.diff(now, [
    "minutes",
    "seconds",
    "milliseconds",
  ]);

  setTimeout(() => {
    setNow(DateTime.local());
  }, 1000);

  return <div>{printf("%02d:%02d", minutes, seconds)}</div>;
};

export default LogoutTimer;
