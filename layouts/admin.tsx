import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "react-bulma-components";
import Link from "next/link";
import LogoutTimer from "components/logoutTimer";
import LogoutReminderModal from "components/logoutReminderModal";
import { DateTime } from "luxon";

interface Props {
  children: React.ReactElement;
}

const Layout: React.FunctionComponent<Props> = ({ children }: Props) => {
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const oldChildren = useRef(children);
  const [isActive, setActive] = useState(false);
  const [logoutTime, setLogoutTime] = useState(
    DateTime.local().plus({ minutes: 30 })
  );
  const [openModel, setOpenModel] = useState(false);

  const toggleActive = () => {
    setActive(!isActive);
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (navBarRef?.current?.contains(event.target as Node) === false) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navBarRef, setActive]);

  useEffect(() => {
    if (!openModel) {
      const openModalTimeout = setTimeout(() => {
        setOpenModel(true);
      }, logoutTime.minus({ minutes: 5 }).diffNow().as("milliseconds"));
      return () => {
        clearTimeout(openModalTimeout);
      };
    }
    return () => {};
  }, [logoutTime, setOpenModel, openModel]);

  if (oldChildren.current !== children) {
    setLogoutTime(DateTime.local().plus({ minutes: 30 }));
    oldChildren.current = children;
  }

  return (
    <div>
      <LogoutReminderModal open={openModel} />
      <div ref={navBarRef}>
        <Navbar
          color="primary"
          fixed="top"
          active={isActive}
          onClick={() => {
            if (isActive) setActive(false);
          }}
        >
          <Navbar.Brand>
            <Link href="/admin">
              <a href="/admin" className="navbar-item">
                <img
                  src="https://bulma.io/images/bulma-logo.png"
                  alt="Bulma: a modern CSS framework based on Flexbox"
                  width="112"
                  height="28"
                />
              </a>
            </Link>
            <Navbar.Item renderAs="div">
              <LogoutTimer time={logoutTime} />
            </Navbar.Item>
            <Navbar.Burger onClick={toggleActive} />
          </Navbar.Brand>
          <Navbar.Menu>
            <Navbar.Container>
              <Link href="/admin/members">
                <a href="/admin/members" className="navbar-item">
                  Members
                </a>
              </Link>
              <Link href="/admin/registrations">
                <a href="/admin/registrations" className="navbar-item">
                  Registrations
                </a>
              </Link>
              <Link href="/admin/soc_settings">
                <a href="/admin/soc_settings" className="navbar-item">
                  Settings
                </a>
              </Link>
              <Link href="/admin/authentication">
                <a href="/admin/authentication" className="navbar-item">
                  Authentication
                </a>
              </Link>
            </Navbar.Container>
            <Navbar.Container position="end">
              <Link href="/api/logout">
                <a href="/api/logout" className="navbar-item">
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

export default Layout;
