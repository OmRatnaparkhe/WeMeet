import { useRef, useState } from "react";
import { Button, Input, Typography } from "antd";
import {WebRTC }from "./WebRTCClient"
import { WeMeet } from "./pages/VideoCall";
import { Dashboard } from "./pages/Dashboard";
import { ChatPanel } from "./pages/ChatPanel";
import { AppRouter } from "./AppRouter";
function App() {
  return <div>
    <AppRouter/>
  </div>
}

export default App;
