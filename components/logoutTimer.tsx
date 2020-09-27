import React, { useState } from "react";
import printf from "printf";
import { useRouter } from "next/router";

interface Props {
  time: number;
}

const LogoutTimer: React.FunctionComponent<Props> = ({ time }: Props) => {
  const [now, setNow] = useState(Math.floor(new Date().valueOf() / 1000));
  const router = useRouter();
  const rem = time - now;
  if (rem < 0) {
    router.push("/");
    return <div>00:00</div>;
  }
  setTimeout(() => {
    setNow(Math.ceil(new Date().valueOf() / 1000));
  }, 1000);
  const hh = Math.floor(rem / 60);
  const mm = rem % 60;
  return <div>{printf("%02d:%02d", hh, mm)}</div>;
};

export default LogoutTimer;
