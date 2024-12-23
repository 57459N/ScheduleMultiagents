import React, { useState } from "react";
import styles from "./ScheduleGenerator.module.css";

const ScheduleGenerator = () => {
  const backendUrl = "http://0.0.0.0:8000/";
  
  const LESSONS_API = "https://6704e89a031fd46a830ddca4.mockapi.io/lessons";
  const TEACHERS_API = "https://6704e89a031fd46a830ddca4.mockapi.io/teachers";

  const [message, setMessage] = useState("");

  const handleGenerateSchedule = async () => {
    try {
      const lessonsResponse = await fetch(LESSONS_API);
      const teachersResponse = await fetch(TEACHERS_API);

      if (!lessonsResponse.ok || !teachersResponse.ok) {
        throw new Error("Failed to fetch data from APIs");
      }

      const lessons = await lessonsResponse.json();
      const teachers = await teachersResponse.json();

      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessons, teachers }),
      });

      if (!response.ok) {
        throw new Error("Failed to process data in the backend");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "schedule.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage("Schedule generated and downloaded successfully!");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className={styles.generator}>
      <h2 className={styles.title}>Запуск генерации расписания</h2>
      <button className={styles.btn} onClick={handleGenerateSchedule}>
        Запуск
      </button>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ScheduleGenerator;
