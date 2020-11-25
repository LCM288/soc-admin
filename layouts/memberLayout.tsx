import React, { useState, useRef, useEffect, useCallback } from "react";
import { Navbar } from "react-bulma-components";
import Link from "next/link";
import LogoutTimer from "components/logoutTimer";
import LogoutReminderModal from "components/logoutReminderModal";
import { useQuery } from "@apollo/react-hooks";
import socNameQuery from "apollo/queries/socSetting/socName.gql";
import { DateTime } from "luxon";
import useClipped from "utils/useClipped";

interface Props {
  children: React.ReactElement;
}

const MemberLayout: React.FunctionComponent<Props> = ({ children }: Props) => {
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const oldChildren = useRef(children);
  const [isActive, setActive] = useState(false);
  const [logoutTime, setLogoutTime] = useState(
    DateTime.local().plus({ minutes: 30 })
  );
  const [openModal, setOpenModal] = useState(false);
  const { data, loading, error } = useQuery(socNameQuery);

  const toggleActive = useCallback(() => {
    setActive(!isActive);
  }, [isActive]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navBarRef?.current?.contains(event.target as Node) === false) {
        setActive(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [navBarRef]);

  useEffect(() => {
    const time = logoutTime.minus({ minutes: 5 }).diffNow().as("milliseconds");
    if (!openModal && time > 0) {
      const openModalTimeout = setTimeout(() => {
        setOpenModal(true);
      }, time);
      return () => {
        clearTimeout(openModalTimeout);
      };
    }
    return () => {};
  }, [logoutTime, setOpenModal, openModal]);
  useClipped(openModal);

  if (oldChildren.current !== children) {
    setLogoutTime(DateTime.local().plus({ minutes: 30 }));
    oldChildren.current = children;
  }

  return (
    <div>
      <LogoutReminderModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
      />
      <div ref={navBarRef}>
        <Navbar
          color="warning"
          fixed="top"
          active={isActive}
          onClick={() => {
            if (isActive) setActive(false);
          }}
        >
          <Navbar.Brand>
            <Link href="/member">
              <a href="/member" className="navbar-item">
                {loading && <p>loading</p>}
                {error && <p>error</p>}
                {data?.socName || <></>}
              </a>
            </Link>
            <Navbar.Item renderAs="div">
              <LogoutTimer time={logoutTime} />
            </Navbar.Item>
            <Navbar.Burger
              onClick={toggleActive}
              onKeyPress={(event: React.KeyboardEvent) =>
                ["Enter", " "].includes(event.key) && toggleActive()
              }
              aria-label="Menu"
              renderAs="a"
            />
          </Navbar.Brand>
          <Navbar.Menu>
            <Navbar.Container position="end">
              <Link href="/logout">
                <a href="/logout" className="navbar-item">
                  Logout
                </a>
              </Link>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
};

export default MemberLayout;
