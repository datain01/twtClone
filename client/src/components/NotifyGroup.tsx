import { Notification } from "@/types";
import Image from "next/image";
import React from "react";
import { ArrowRepeat, Chat, HeartFill } from "react-bootstrap-icons";

interface NottifyGroupProps {
  notification: Notification;
}

const NotifyGroup: React.FC<NottifyGroupProps> = ({ notification }) => {
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

  return (
    <div>
      <div
        className="card"
        style={{
          width: "100%",
          borderRadius: 0,
          borderLeft: "none",
          borderRight: "none",
        }}
      >
        <div className="card-body">
          <h5 className="card-title">
            <span className="me-2">
              {notification.type === "like" && <HeartFill />}
              {notification.type === "retweet" && <ArrowRepeat />}
              {notification.type === "reply" && <Chat />}
            </span>
            <Image src={notification.sender.profileUrl} alt="프로필 이미지" />
            {/* sender의 프사 */}
          </h5>
          <p className="card-text">
            {notification.sender.username} {getNotificationText()}
          </p>
          <p className="text-muted">{notification.tweet?.content}</p>
          {/* 내 트윗의 내용 일부 */}
        </div>
      </div>
    </div>
  );
};

export default NotifyGroup;
