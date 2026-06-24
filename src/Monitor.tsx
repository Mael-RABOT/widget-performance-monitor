import React from "react";
import { Cpu, MemoryStick } from "lucide-react";
import './Monitor.css';

interface SystemInfo {
  cpu_usage: number;
  memory_usage: number;
  total_memory: number;
}

interface MonitorProps {
  info: SystemInfo | null;
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const Monitor: React.FC<MonitorProps> = ({ info }) => {
  if (!info) {
    return <div className="monitor-container">Loading...</div>;
  }

  const memoryPercentage = (info.memory_usage / info.total_memory) * 100;

  return (
    <div className="monitor-container">
      <div className="monitor-section">
        <div className="monitor-header">
          <Cpu size={20} className="monitor-icon" />
          <span className="monitor-title">CPU </span>
          <span className="monitor-value">{`${info.cpu_usage.toFixed(1)}%`}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${info.cpu_usage}%` }}
          ></div>
        </div>
      </div>

      <div className="monitor-section">
        <div className="monitor-header" >
          <MemoryStick size={20} className="monitor-icon" />
          <span className="monitor-title">RAM </span>
          <span className="monitor-value">
            {`${formatBytes(info.memory_usage, 1)}`}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{ width: `${memoryPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Monitor;