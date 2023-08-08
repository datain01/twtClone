import { Notification } from "@/types";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";

interface NotificationContextProps {
  //타입 정의
  notifications: Notification[];
  fetchNotifications: (username?: string) => Promise<void>;
}

//알림 정보를 관리하는 context 생성
const NotificationContext = createContext<NotificationContextProps>({
  notifications: [], //알림 배열을 가져옴
  fetchNotifications: async () => {}, //알림 정보 관리하는 함수
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticated, user } = useAuth(); //useAuth로 인증과 현재 유저 정보 가져옴
  const [notifications, setNotifications] = useState<Notification[]>([]);

  //서버에서 알림을 가져오는 함수
  const fetchNotifications = async (username?: string) => {
    try {
      const res = await axios.get(`/users/${username}/notifications`);
      setNotifications(res.data);
      console.log("Username 확인:", username);
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect에서 Interval을 사용해서 주기적으로 알림을 가져옴
  useEffect(() => {
    if (authenticated && user) {
      const interval = setInterval(() => {
        fetchNotifications(user.username);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [authenticated, user]);

  return (
    <NotificationContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => {
  return useContext(NotificationContext);
};
