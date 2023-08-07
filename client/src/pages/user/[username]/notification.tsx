import NotifyGroup from "@/components/NotifyGroup";
import { Notification } from "@/types";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useSWR from "swr";

const NotificationPage = () => {
  const router = useRouter();
  const username = router.query.username;

  const { data: notificationsData, error: notificationsError } = useSWR<any>(
    username ? `/users/${username}/notifications` : null,
    {
      refreshInterval: 10000,
    }
  );

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
        {notificationsData?.map((notification: Notification) => (
          <NotifyGroup key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
