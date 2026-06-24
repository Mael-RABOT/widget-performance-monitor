import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";
import Monitor from "./Monitor";

interface SystemInfo {
  cpu_usage: number;
  memory_usage: number;
  total_memory: number;
}

function App() {
  const [info, setInfo] = useState<SystemInfo | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const fetchSystemInfo = async () => {
    try {
      const newInfo: SystemInfo = await invoke("get_system_info");
      setInfo(newInfo);
    } catch (e) {
      console.error("Error fetching system info:", e);
    }
  };

  useEffect(() => {
    fetchSystemInfo();

    const interval = setInterval(fetchSystemInfo, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchSize() {
      const appWindow = getCurrentWindow();
      const newSize = await appWindow.innerSize();
      setSize(newSize.toLogical(await appWindow.scaleFactor()));
    }
    fetchSize();
  }, []);

  return (
  <div
    className="widget"
    style={{
      width: size.width,
      height: size.height,
    }}
  >
    <div className="widget-header">
      <span>SYSTEM MONITOR</span>
      <span className="status-dot">● ONLINE</span>
    </div>

    <div className="widget-frame">
      <Monitor info={info} />
    </div>
  </div>
);
}

export default App;