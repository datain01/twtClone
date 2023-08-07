import { Notification } from "@/types";
import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";

interface NotificationContextProps {
  notifications: Notification[];
  fetchNotifications: (username?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  fetchNotifications: async () => {},
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { authenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async (username?: string) => {
    try {
      const res = await axios.get(`/users/${username}/notifications`);
      setNotifications(res.data);
    } catch (error) {
      console.log(error);
    }
  };

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
