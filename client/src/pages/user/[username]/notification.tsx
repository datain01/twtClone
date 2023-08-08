import NotifyGroup from "@/components/NotifyGroup";
import { useAuth } from "@/context/auth";
import { useNotify } from "@/context/notify";
import { Notification } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

const NotificationPage = () => {
  const { notifications, fetchNotifications } = useNotify();
  const { user } = useAuth();

  const [notifyLength, setNotifyLength] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const markAsRead = async () => {
    try {
      setLoading(true);
      const username = user?.username;
      await axios.put(`/users/${username}/notifications/read`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error, "읽음 표시 오류");
    }
  };

  useEffect(() => {
    if (notifications?.length !== notifyLength) {
      setNotifyLength(notifications?.length || 0); //notifylength 업뎃
      const timer = setTimeout(async () => {
        await markAsRead();
        fetchNotifications();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (loading) {
    return <div>Loading...</div>;
  }

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
