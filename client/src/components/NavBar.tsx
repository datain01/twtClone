import React, { useContext, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Bell,
  BellFill,
  Bookmarks,
  BookmarksFill,
  HouseDoor,
  HouseDoorFill,
  PencilFill,
  PencilSquare,
  Person,
  PersonFill,
  Search,
  SearchHeart,
  Twitter,
} from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { useAuth } from "@/context/auth";
import { useNotify } from "@/context/notify";
import { useDarkMode, useDarkModeClassNames } from "@/context/darkmode";

const NavBar: React.FC = () => {
  const router = useRouter();
  const { logout, user, authenticated, loading } = useAuth();
  const { notifications } = useNotify();
  const { toggleDarkMode, isDarkMode } = useDarkMode();
  const { backgroundClass, textClass } = useDarkModeClassNames();

  const [isHomeHovered, setHomeIsHovered] = useState(false);
  const [isSearchHovered, setSearchIsHovered] = useState(false);
  const [isNotifyHovered, setNotifyIsHovered] = useState(false);
  const [isBookmarkHovered, setBookmarkIsHovered] = useState(false);
  const [isUserHovered, setUserIsHovered] = useState(false);
  const [isPostHovered, setPostIsHovered] = useState(false);

  const unread = notifications?.filter((n) => !n.read).length || 0;
  const iconFill = isDarkMode ? "white" : "black";
  const darkmodeOrNot = isDarkMode ? "Light Mode" : "Dark Mode";

  const handleLogout = () => {
    logout().then(() => {
      window.location.reload();
    });
  };

  return (
    <div
      className={`d-flex flex-column flex-shrink-0 ${backgroundClass} position-sticky border-end border-secondary`}
      style={{ width: "4.5rem", top: "0", zIndex: 10 }} //여기 포지션 top, left 수정 및 추가하기
    >
      <div className="position-sticky" style={{ top: "0" }}>
        <Link
          href="/"
          className="d-block p-4 link-dark text-decoration-none "
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          data-bs-original-title="Icon-only"
        >
          <Twitter width="24" height="24" fill={iconFill} />
          <span className="visually-hidden">Icon-only</span>
        </Link>

        <ul className="nav nav-pills nav-plush flex-column mb-auto text-center">
          <li className="nav-item">
            <Link
              href="/"
              className="nav-link py-3 border-bottom rounded-0"
              aria-current="page"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="Home"
              data-bs-original-title="Home"
              onMouseEnter={() => setHomeIsHovered(true)}
              onMouseLeave={() => setHomeIsHovered(false)}
            >
              {isHomeHovered ? (
                <HouseDoorFill width="24" height="24" fill={iconFill} />
              ) : (
                <HouseDoor width="24" height="24" fill={iconFill} />
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/search"
              className="nav-link py-3 border-bottom rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="Search"
              data-bs-original-title="Search"
              onMouseEnter={() => setSearchIsHovered(true)}
              onMouseLeave={() => setSearchIsHovered(false)}
            >
              {isSearchHovered ? (
                <SearchHeart width="24" height="24" fill={iconFill} />
              ) : (
                <Search width="24" height="24" fill={iconFill} />
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href={`/user/${user?.username}/notification`}
              className="nav-link py-3 border-bottom rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="Alarm"
              data-bs-original-title="Alarm"
              onMouseLeave={() => setNotifyIsHovered(false)}
              onMouseEnter={() => setNotifyIsHovered(true)}
            >
              <div style={{ position: "relative", display: "inline-block" }}>
                {isNotifyHovered ? (
                  <BellFill width="24" height="24" fill={iconFill} />
                ) : (
                  <Bell width="24" height="24" fill={iconFill} />
                )}
                {unread > 0 && (
                  <span
                    className="badge bg-danger"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-10px",
                    }}
                  >
                    {unread}
                  </span>
                )}
              </div>
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href={`/user/${user?.username}/bookmark`}
              className="nav-link py-3 border-bottom rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="Bookmark"
              data-bs-original-title="Bookmark"
              onMouseEnter={() => setBookmarkIsHovered(true)}
              onMouseLeave={() => setBookmarkIsHovered(false)}
              onClick={(e) => {
                if (!authenticated) {
                  e.preventDefault();
                  router.push("login");
                }
              }}
            >
              {isBookmarkHovered ? (
                <BookmarksFill width="24" height="24" fill={iconFill} />
              ) : (
                <Bookmarks width="24" height="24" fill={iconFill} />
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href={`/user/${user?.username}`}
              className="nav-link py-3 border-bottom rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="User"
              data-bs-original-title="User"
              onMouseEnter={() => setUserIsHovered(true)}
              onMouseLeave={() => setUserIsHovered(false)}
              onClick={(e) => {
                if (!authenticated) {
                  e.preventDefault();
                  router.push("login");
                }
              }}
            >
              {isUserHovered ? (
                <PersonFill width="24" height="24" fill={iconFill} />
              ) : (
                <Person width="24" height="24" fill={iconFill} />
              )}
            </Link>
          </li>

          <li className="nav-item">
            <Link
              href="/post"
              className="nav-link py-3 border-bottom rounded-0"
              data-bs-toggle="tooltip"
              data-bs-placement="right"
              aria-label="Post"
              data-bs-original-title="Post"
              onMouseEnter={() => setPostIsHovered(true)}
              onMouseLeave={() => setPostIsHovered(false)}
              onClick={(e) => {
                if (!authenticated) {
                  e.preventDefault();
                  router.push("login");
                }
              }}
            >
              {isPostHovered ? (
                <PencilFill width="24" height="24" fill={iconFill} />
              ) : (
                <PencilSquare width="24" height="24" fill={iconFill} />
              )}
            </Link>
          </li>
        </ul>

        <div style={{ marginTop: "auto" }}>
          <Dropdown>
            <Dropdown.Toggle
              variant="transparent"
              style={{ backgroundColor: "transparent", border: "none" }}
            >
              <Image
                src={
                  user?.profileUrl ||
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                }
                alt="user"
                width="40"
                height="40"
                className="rounded-circle"
              />
              {/* 로그인이 안됐으면 기본 이미지 표시 */}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={toggleDarkMode}>
                {darkmodeOrNot}
              </Dropdown.Item>
              <Dropdown.Item
                href={`/user/${user?.username}`}
                onClick={(e) => {
                  if (!authenticated) {
                    e.preventDefault();
                    router.push("login");
                  }
                }}
              >
                Profile
              </Dropdown.Item>
              <Dropdown.Divider />
              {!loading && authenticated ? (
                <Dropdown.Item onClick={handleLogout}>Sign Out</Dropdown.Item>
              ) : (
                <>
                  <Dropdown.Item href="/login">Login</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
