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
      const lessonsData = await lessonsResponse.json();
      const teachersData = await teachersResponse.json();
      
      const lessons = lessonsData.map((lesson) => ({
        id: Number(lesson.id), // Ensure id is an integer
        group: lesson.group.map((group) => ({
          group_id: Number(group.group_id),
          flow: Number(group.flow),
          speciality: group.speciality || "", // Default to empty string if undefined
          number: String(group.number), // Ensure 'number' is sent as a string
          subgroup: Number(group.subgroup),
        })),
        subject: {
          sub_id: Number(lesson.subject.sub_id),
          name: lesson.subject.name || "", // Default to empty string if undefined
        },
        type: lesson.type || "", // Ensure type is a string
        length: Number(lesson.length),
        teacher: Number(lesson.teacher),
        is_set: Boolean(lesson.is_set), // Ensure is_set is a boolean
      }));
      
      const teachers = teachersData.map((teacher) => ({
        id: Number(teacher.id), // Ensure id is an integer
        name: teacher.name || "", // Default to empty string if undefined
        schedule: teacher.schedule.map((day) =>
          day.map((hour) => Number(hour)) // Ensure all values in schedule are integers
        ),
      }));
      
      console.log({ lessons, teachers });
      
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lessons, teachers }), // Send formatted data
      });
      
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error:", errorDetails);
      }
      

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
