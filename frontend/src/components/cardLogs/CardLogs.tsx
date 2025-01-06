import React from "react";
import "./card-logs-styles.scss";
import { CardLogsProps } from "../../models/components";

const CardLogs: React.FC<CardLogsProps> = ({ logs }) => {
  const formatTime = (time: string): string => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const logDate = new Date(time);
    const logDateString = logDate.toLocaleDateString();

    const todayString = today.toLocaleDateString();
    const yesterdayString = yesterday.toLocaleDateString();

    if (logDateString === todayString) {
      return "Today";
    } else if (logDateString === yesterdayString) {
      return "Yesterday";
    } else {
      return logDateString;
    }
  };

  const groupLogsByTime = (
    logs: { timestamp: string; description: string }[]
  ) => {
    return logs.reduce((groups, log) => {
      const time = formatTime(log.timestamp);
      if (!groups[time]) {
        groups[time] = [];
      }
      groups[time].push(log);
      return groups;
    }, {} as Record<string, { timestamp: string; description: string }[]>);
  };

  // Group logs by formatted time
  const groupedLogs = groupLogsByTime(logs || []);

  return (
    <div className="card-logs">
      {Object.keys(groupedLogs).map((time) => (
        <div key={time} className="card-logs-group">
          <div className="card-logs-header">
            <h3>{time}</h3>
          </div>
          <ul>
            {groupedLogs[time].map((log) => (
              <li key={log.timestamp}>
                <div className="card-log-entry">
                  <span className="log-description">{log.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CardLogs;
