import React, { useState, useRef, useEffect } from "react";
import { Navbar } from "react-bulma-components";
import Link from "next/link";
import LogoutTimer from "components/logoutTimer";

interface Props {
  children: React.ReactElement;
  time: number;
}

const Layout: React.FunctionComponent<Props> = ({ children, time }: Props) => {
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const [isActive, setActive] = useState(false);

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

  return (
    <div>
      <div ref={navBarRef}>
        <Navbar color="primary" fixed="top" active={isActive}>
          <Navbar.Brand>
            <Link href="/admin">
              <Navbar.Item onClick={() => setActive(false)}>
                <img
                  src="https://bulma.io/images/bulma-logo.png"
                  alt="Bulma: a modern CSS framework based on Flexbox"
                  width="112"
                  height="28"
                />
              </Navbar.Item>
            </Link>
            <Navbar.Item renderAs="div">
              <LogoutTimer time={time} />
            </Navbar.Item>
            <Navbar.Burger onClick={toggleActive} />
          </Navbar.Brand>
          <Navbar.Menu>
            <Navbar.Container>
              <Link href="/admin/registrations">
                <Navbar.Item onClick={() => setActive(false)}>
                  Registrations
                </Navbar.Item>
              </Link>
            </Navbar.Container>
            <Navbar.Container position="end">
              <Link href="/api/logout">
                <Navbar.Item>Logout</Navbar.Item>
              </Link>
            </Navbar.Container>
          </Navbar.Menu>
        </Navbar>
      </div>
      {children}
    </div>
  );
};

export default Layout;
