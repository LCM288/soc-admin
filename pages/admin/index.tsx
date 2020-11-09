import React from "react";
import { DateTime } from "luxon";
import Layout from "layouts/admin";
import { ServerSideProps } from "utils/getServerSideProps";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

export default function Index({ user }: ServerSideProps): React.ReactElement {
  const getGreetingTime = () => {
    // ref: https://gist.github.com/James1x0/8443042
    let g = null; // return g

    const splitMoring = 5; // 24hr time to split the afternoon
    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = DateTime.local().hour;

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      g = "Good afternoon";
    } else if (currentHour >= splitEvening || currentHour <= splitMoring) {
      g = "Good evening";
    } else {
      g = "Good morning";
    }

    return g;
  };

  if (user) {
    return (
      <div>
        {getGreetingTime()}, {user.name}
      </div>
    );
  }
  return <a href="/login">Please login first </a>;
}

Index.Layout = Layout;
