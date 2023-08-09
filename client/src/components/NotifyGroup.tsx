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

  return (
    <div>
      <Link href={`/${identifier}/${slug}`} style={{ textDecoration: "none" }}>
        <div
          className="card"
          style={{
            borderRadius: 0,
            borderLeft: "none",
            borderRight: "none",
            backgroundColor: notification.read ? "#D3D3D3" : "white",
          }}
        >
          <div className="card-body">
            <h5 className="card-title">
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
            <p className="card-text">
              {notification.sender.nickname} {getNotificationText()}
            </p>
            <p className="text-muted">{notification.tweet?.content}</p>
          </div>

          {/* 내 트윗의 내용 일부 */}
        </div>
      </Link>
    </div>
  );
};

export default NotifyGroup;
