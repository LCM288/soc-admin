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

const AdminLayout: React.FunctionComponent<Props> = ({ children }: Props) => {
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
    const handleClickOutside = (event: Event) => {
      if (navBarRef?.current?.contains(event.target as Node) === false) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          color="info"
          fixed="top"
          active={isActive}
          onClick={() => {
            if (isActive) setActive(false);
          }}
        >
          <Navbar.Brand>
            <Link href="/admin">
              <a href="/admin" className="navbar-item">
                {loading && <p>loading</p>}
                {error && <p>error</p>}
                {data?.socName || <></>}
              </a>
            </Link>
            <Navbar.Item renderAs="div">
              <LogoutTimer time={logoutTime} />
            </Navbar.Item>
            <Navbar.Burger onClick={toggleActive} />
          </Navbar.Brand>
          <Navbar.Menu>
            <Navbar.Container>
              <Navbar.Item dropdown hoverable>
                <Navbar.Link>Members</Navbar.Link>
                <Navbar.Dropdown>
                  <Link href="/admin/members/import">
                    <a href="/admin/members/import" className="navbar-item">
                      Import Member
                    </a>
                  </Link>
                  <Link href="/admin/members">
                    <a href="/admin/members" className="navbar-item">
                      Member List
                    </a>
                  </Link>
                  <Link href="/admin/registrations">
                    <a href="/admin/registrations" className="navbar-item">
                      Member Registrations
                    </a>
                  </Link>
                </Navbar.Dropdown>
              </Navbar.Item>

              <Navbar.Item dropdown hoverable>
                <Navbar.Link>Admins</Navbar.Link>
                <Navbar.Dropdown>
                  <Link href="/admin/admins">
                    <a href="/admin/admins" className="navbar-item">
                      Admin List
                    </a>
                  </Link>
                  <Link href="/admin/soc_settings">
                    <a href="/admin/soc_settings" className="navbar-item">
                      Change Settings
                    </a>
                  </Link>
                  <Link href="/admin/logs">
                    <a href="/admin/logs" className="navbar-item">
                      Check Logs
                    </a>
                  </Link>
                  <Link href="/admin/authentication">
                    <a href="/admin/authentication" className="navbar-item">
                      Update Client ID and Client Secret
                    </a>
                  </Link>
                </Navbar.Dropdown>
              </Navbar.Item>
            </Navbar.Container>
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

export default AdminLayout;
