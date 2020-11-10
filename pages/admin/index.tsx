import React, { useMemo } from "react";
import { DateTime } from "luxon";
import AdminLayout from "layouts/adminLayout";
import Link from "next/link";
import { ServerSideProps } from "utils/getServerSideProps";

export { getAdminPageServerSideProps as getServerSideProps } from "utils/getServerSideProps";

const Index = ({ user }: ServerSideProps): React.ReactElement => {
  const greeting = useMemo(() => {
    // ref: https://gist.github.com/James1x0/8443042

    const splitMoring = 5; // 24hr time to split the afternoon
    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 17; // 24hr time to split the evening
    const currentHour = DateTime.local().hour;

    const userName = user?.name ?? "";

    if (splitAfternoon <= currentHour && currentHour <= splitEvening) {
      return `Good afternoon, ${userName}`;
    }
    if (currentHour <= splitMoring || splitEvening <= currentHour) {
      return `Good evening, ${userName}`;
    }
    return `Good morning, ${userName}`;
  }, [user]);

  if (user) {
    return (
      <>
        <div className="mb-2">{greeting}</div>
        <Link href="/member">
          <a href="/member" className="button is-warning">
            Member Page
          </a>
        </Link>
      </>
    );
  }
  return <a href="/login">Please login first </a>;
};

Index.Layout = AdminLayout;

export default Index;
