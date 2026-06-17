"use client";

import React, { useState } from "react";
import { Screen } from "./utils/types";
import { FeedPage } from "./pages/FeedPage";
import { TodoPage } from "./pages/TodoPage";
import { UploadPage } from "./pages/UploadPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { BottomNav } from "./components/BottomNav";
import { useApp } from "./context/AppContext";

export default function Home() {
  const { isAuthenticated, loginUser } = useApp();
  const [screen, setScreen] = useState<Screen>("feed");

  const handleLogin = () => {
    loginUser();
    setScreen("feed");
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderScreen = () => {
    switch (screen) {
      case "feed":
        return <FeedPage onNavigate={setScreen} />;
      case "todo":
        return <TodoPage />;
      case "upload":
        return <UploadPage onNavigate={setScreen} />;
      case "profile":
        return <ProfilePage onNavigate={setScreen} />;
      default:
        return <FeedPage onNavigate={setScreen} />;
    }
  };

  return (
    <div className="bg-dark-bg min-h-[100dvh] pb-[60px]">
      {renderScreen()}
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  );
}
