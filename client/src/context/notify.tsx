import { Notification } from "@/types";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { io, Socket } from "socket.io-client";

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
  let socket: Socket;

  //서버에서 알림을 가져오는 함수
  const fetchNotifications = async (username?: string) => {
    try {
      const res = await axios.get(`/users/${username}/notifications`);
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  //useEffect에서 소켓 통신을 이용해서 알림을 가져옴
  useEffect(() => {
    if (authenticated && user) {
      fetchNotifications(user.username);
      const serverURL =
        process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:4000";
      socket.on("connect", () => {
        console.log("서버에 성공적으로 연결됨!!");
      });
      socket.emit("connect-notification", user.username); //알림 구독

      socket.on("new-notification", (notification: Notification) => {
        setNotifications((prevNotifications) => [
          notification,
          ...prevNotifications,
        ]);
      });
    }

    return () => {
      socket?.disconnect();
    };
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
