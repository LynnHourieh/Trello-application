import React, { useEffect, useState } from "react";
import CardLogs from "../../components/cardLogs/CardLogs.tsx";

function LogsPage() {
  const baseUrl = `http://localhost:8000/api`;
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch(`${baseUrl}/logs`);
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      const data = await response.json();
      setLogs(data);
    };

    fetchLogs();
  }, []);

  return <CardLogs logs={logs} />;
}

export default LogsPage;
