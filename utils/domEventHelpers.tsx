import React from "react";

export const stop = (event: React.SyntheticEvent): void => {
  event.stopPropagation();
};

export const prevent = (event: React.SyntheticEvent): void => {
  event.preventDefault();
};

export const stopAndPrevent = (event: React.SyntheticEvent): void => {
  event.stopPropagation();
  event.preventDefault();
};

/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
export const StopClickDiv = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => <div onClick={stop}>{children}</div>;
