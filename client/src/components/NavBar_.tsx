import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import {
  Bell,
  Bookmarks,
  Envelope,
  HouseDoor,
  PencilSquare,
  Person,
  Search,
  ThreeDots,
  Twitter,
} from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import { useAuthDispatch, useAuthState } from "@/context/auth_";

// auth.tsx 수정전 이전 NavBar 코드
const NavBar: React.FC = () => {
  const { loading, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const { user } = useAuthState();

  const logout = () => {
    axios
      .post("/auth/logout")
      .then(() => {
        //then 메서드는 자바스크립트에서 Promise가 성공적으로 완료됐을때 호출되는 콜백함수
        dispatch("LOGOUT"); //디스패치 케이스 중 로그아웃을 가져오는 것
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      className="d-flex flex-column flex-shrink-0 bg-light"
      style={{ width: "4.5rem" }}
    >
      <Link
        href="/"
        className="d-block p-4 link-dark text-decoration-none "
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        data-bs-original-title="Icon-only"
      >
        <Twitter width="24" height="24" />
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
          >
            <HouseDoor width="24" height="24" fill="black" />
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
          >
            <Search width="24" height="24" fill="black" />
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href="#"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            aria-label="Alarm"
            data-bs-original-title="Alarm"
          >
            <Bell width="24" height="24" fill="black" />
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href="#"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            aria-label="Dm"
            data-bs-original-title="Dm"
          >
            <Envelope width="24" height="24" fill="black" />
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
            onClick={(e) => {
              if (!authenticated) {
                e.preventDefault();
                router.push("login");
              }
            }}
          >
            <Bookmarks width="24" height="24" fill="black" />
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
            onClick={(e) => {
              if (!authenticated) {
                e.preventDefault();
                router.push("login");
              }
            }}
          >
            <Person width="24" height="24" fill="black" />
          </Link>
        </li>

        <li className="nav-item">
          <Link
            href="#"
            className="nav-link py-3 border-bottom rounded-0"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            aria-label="Option"
            data-bs-original-title="Option"
          >
            <ThreeDots width="24" height="24" fill="black" />
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
            onClick={(e) => {
              if (!authenticated) {
                e.preventDefault();
                router.push("login");
              }
            }}
          >
            <PencilSquare width="24" height="24" fill="black" />
          </Link>
        </li>
      </ul>
      <div className="dropdown border-top">
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
            <Dropdown.Item href="#">Settings</Dropdown.Item>
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
              <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
            ) : (
              <>
                <Dropdown.Item href="/login">Login</Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;
