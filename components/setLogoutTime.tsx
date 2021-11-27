import React from "react";
import { User } from "@/types/datasources";
import { useSetLogoutTime } from "utils/useTimerState";

interface Props {
  // eslint-disable-next-line react/require-default-props
  user?: User | undefined;
}

const SetLogoutTime = ({ user }: Props): React.ReactElement => {
  useSetLogoutTime(user?.exp ?? -1);
  return <></>;
};

export default SetLogoutTime;
