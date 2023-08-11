import { useDarkMode, useDarkModeClassNames } from "@/context/darkmode";
import { Notification } from "@/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { ArrowRepeat, Chat, HeartFill } from "react-bootstrap-icons";

interface NotifyGroupProps {
  notification: Notification;
  slug: string;
  identifier: string;
}

const NotifyGroup: React.FC<NotifyGroupProps> = ({
  notification,
  slug,
  identifier,
}) => {
  const getNotificationText = () => {
    if (notification.type === "like") {
      return "님이 마음에 들어합니다.";
    } else if (notification.type === "retweet") {
      return "님이 리트윗 했습니다.";
    } else if (notification.type === "reply") {
      return "님이 멘션을 보냈습니다.";
    } else {
      return "";
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/user/${notification.sender.username}`;
  };

  const { backgroundClass, textClass, mutedTextClass } =
    useDarkModeClassNames(); //다크모드
  const { isDarkMode } = useDarkMode();

  const backgroundColor = isDarkMode
    ? notification.read
      ? "#3f3f3f"
      : "#2b2b2b"
    : notification.read
    ? "#D3D3D3"
    : "white";

  return (
    <div className={`${backgroundClass}`}>
      <Link href={`/${identifier}/${slug}`} style={{ textDecoration: "none" }}>
        <div
          className="card"
          style={{
            borderRadius: 0,
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: backgroundColor,
          }}
        >
          <div className={`card-body ${textClass}`}>
            <h5 className={`card-title ${textClass}`}>
              <span className="me-2">
                {notification.type === "like" && <HeartFill fill="red" />}
                {notification.type === "retweet" && (
                  <ArrowRepeat fill="#38B2AC" />
                )}
                {notification.type === "reply" && <Chat />}
              </span>

              <span onClick={handleProfileClick}>
                <Image
                  src={notification.sender.profileUrl}
                  alt="프로필 이미지"
                  width={40}
                  height={40}
                  className="rounded-circle"
                />
              </span>

              {/* sender의 프사 */}
            </h5>
          </div>
          <div className="ms-3">
            <p className={`card-text ${textClass}`}>
              {notification.sender.nickname} {getNotificationText()}
            </p>
            <p className={`${mutedTextClass}`}>{notification.tweet?.content}</p>
          </div>

          {/* 내 트윗의 내용 일부 */}
        </div>
      </Link>
    </div>
  );
};

export default NotifyGroup;
