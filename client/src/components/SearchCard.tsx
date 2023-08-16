import { useAuth } from "@/context/auth";
import { useDarkModeClassNames } from "@/context/darkmode";
import { Tweet } from "@/types";
import axios from "axios";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useState, Ref } from "react";
import {
  ArrowRepeat,
  Bookmark,
  BookmarkFill,
  Chat,
  Heart,
  HeartFill,
} from "react-bootstrap-icons";

interface SearchCardProps {
  tweet: Tweet;
  innerRef?: React.Ref<HTMLDivElement>; // innerRef라는 이름으로 Ref를 추가
}

const SearchCard: React.FC<SearchCardProps> = ({
  tweet: { identifier, slug, content, user, createdAt },
  innerRef,
}) => {
  const router = useRouter();
  const { user: currentUser, authenticated } = useAuth();
  const { backgroundClass, textClass, mutedTextClass } =
    useDarkModeClassNames(); //다크모드

  const currentUserProfileUrl =
    currentUser?.profileUrl ||
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div
      className={`card  ${backgroundClass} ${textClass}`}
      style={{ borderRadius: 0, borderLeft: "none", borderRight: "none" }}
      onClick={() => router.push(`/${identifier}/${slug}`)}
      ref={innerRef}
    >
      <div className="card-body ">
        <div className="mt-3 ms-4">
          {/* 본 트윗 시작*/}

          <>
            <div className="d-flex">
              <Link
                href={`/user/${user?.username}`}
                className={`text-decoration-none ${textClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Image
                  src={user?.profileUrl}
                  alt="프로필 사진"
                  width={50}
                  height={50}
                  className="rounded-circle"
                />
              </Link>
              <Link
                href={`/user/${user?.username}`}
                className={`text-decoration-none ${textClass}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <div className="ms-3">
                  <strong className={`${textClass}`}>{user?.nickname}</strong>
                  <p className={`mb-0 ${mutedTextClass}`}>@{user?.username}</p>
                </div>
              </Link>
            </div>
            <p className="mt-2 fs-5" onClick={(e) => e.stopPropagation()}>
              {content}
            </p>
            <p className={`fs-6 ${mutedTextClass}`}>
              {dayjs(createdAt)
                .add(9, "hour")
                .format("A HH:mm · YYYY년 MM월 DD일")}
            </p>
          </>

          {/* 본 트윗 끝 */}
        </div>
      </div>
    </div>
  );
};

export default SearchCard;
