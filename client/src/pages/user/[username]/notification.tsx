import NotifyGroup from "@/components/NotifyGroup";
import { useAuth } from "@/context/auth";
import { useNotify } from "@/context/notify";
import { Notification } from "@/types";
import axios from "axios";
import React, { useEffect } from "react";

const NotificationPage = () => {
  const { notifications, fetchNotifications } = useNotify();
  const { user } = useAuth();

  const markAsRead = async () => {
    try {
      const username = user?.username;
      await axios.put(`/users/${username}/notifications/read`);
    } catch (error) {
      console.log(error, "읽음 표시 오류");
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      //서버에 읽은 것으로 표시하는 요청을 보내는 로직
      await markAsRead();

      // 서버에 재요청해서 알림을 다시 가져옴
      fetchNotifications();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "auto" }}>
      <div
        className="container border-bottom fs-3 fw-light ms-4"
        style={{ height: "3rem" }}
      >
        알림
      </div>
      <div>
        {/* 검색해서 나온 트윗들 나열 */}
        {notifications?.map((notification: Notification) => (
          <NotifyGroup
            key={notification.id}
            notification={notification}
            slug={notification.tweet?.slug || ""}
            identifier={notification.tweet?.identifier || ""}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
