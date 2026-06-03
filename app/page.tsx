"use client";

import React, { useState } from "react";
import { Screen } from "./utils/types";
import { FeedPage } from "./pages/FeedPage";
import { TodoPage } from "./pages/TodoPage";
import { UploadPage } from "./pages/UploadPage";
import { ProfilePage } from "./pages/ProfilePage";
import { LoginPage } from "./pages/LoginPage";
import { BottomNav } from "./components/BottomNav";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("feed");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (target: Screen) => {
    setIsAuthenticated(true);
    setScreen(target);
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
    <div style={{ background: "#101411", minHeight: "100dvh" }}>
      {renderScreen()}
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  );
}