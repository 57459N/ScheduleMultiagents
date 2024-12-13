import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import LessonsList from './components/LessonsList/LessonsList';
import AddLessonForm from './components/AddLessonForm/AddLessonForm';
import ScheduleGenerator from './components/ScheduleGenerator/ScheduleGenerator';
import TeachersList from './components/TeachersList/TeachersList';
import TeachersTime from './components/teachersTime/TeachersTime';
import GroupsList from './components/GroupsList/GroupsList';
import styles from './App.module.css';
import { groups, subjects, typeOfLessons, lengthOfLessons } from './data/data';
import TableLoader from './components/TableLoader/TableLoader';
//import AppContextProvider from './AppContextProvider';

const LESSONS_API = 'https://6704e89a031fd46a830ddca4.mockapi.io/lessons';
const TEACHERS_API = 'https://6704e89a031fd46a830ddca4.mockapi.io/teachers';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('lessonsList');
  const [lessonsLst, setLessonsLst] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true);
    fetch(LESSONS_API)
      .then((res) => res.json())
      .then(setLessonsLst)
      .catch((err) => console.error('Failed to fetch lessons:', err));

    fetch(TEACHERS_API)
      .then((res) => res.json())
      .then(setTeachers)
      .then(() => setIsLoading(false))
      .catch((err) => console.error('Failed to fetch teachers:', err));
    //setIsLoading(false);
  }, []);

  // Add a new lesson
  const addLesson = async (newLesson) => {
    try {
      // Prepare data for API
      const lessonToSend = formatLessonDataForApi(newLesson);
      console.log('Lesson to send:', lessonToSend);
      const response = await fetch(LESSONS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonToSend),
      });
      const createdLesson = await response.json();
      setLessonsLst((prev) => [...prev, createdLesson]);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to add lesson:', err);
    }
  };
  const addTeacher = async (newTeacher) => {
    try {
      const response = await fetch(TEACHERS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeacher),
      });

      const createdTeacher = await response.json();
      setTeachers((prev) => [...prev, createdTeacher]);
    } catch (err) {
      console.error('Ошибка при добавлении преподавателя:', err);
      throw err;
    }
  };

  const deleteTeacher = async (teacherId) => {
    try {
      await fetch(`${TEACHERS_API}/${teacherId}`, { method: 'DELETE' });
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== teacherId));
    } catch (err) {
      console.error('Ошибка при удалении преподавателя:', err);
    }
  };
  const updateTeacherSchedule = async (teacherId, schedule) => {
    try {
      const response = await fetch(`${TEACHERS_API}/${teacherId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schedule }),
      });
      const updatedTeacher = await response.json();
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === updatedTeacher.id ? updatedTeacher : teacher)),
      );
    } catch (err) {
      console.error('Ошибка при обновлении расписания:', err);
    }
  };

  // Update an existing lesson
  const updateLesson = async (updatedLesson) => {
    try {
      // Prepare data for API
      const lessonToSend = formatLessonDataForApi(updatedLesson);
      const response = await fetch(`${LESSONS_API}/${updatedLesson.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonToSend),
      });
      const savedLesson = await response.json();
      setLessonsLst((prev) =>
        prev.map((lesson) => (lesson.id === savedLesson.id ? savedLesson : lesson)),
      );
      setIsModalOpen(false);
      setIsEditMode(false);
      setSelectedLesson(null);
    } catch (err) {
      console.error('Failed to update lesson:', err);
    }
  };

  // Delete a lesson
  const deleteLesson = async (lessonId) => {
    try {
      await fetch(`${LESSONS_API}/${lessonId}`, { method: 'DELETE' });
      setLessonsLst((prev) => prev.filter((lesson) => lesson.id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  // Function to format the lesson data before sending to API
  const formatLessonDataForApi = (lesson) => {
    console.log('Lesson:', lesson);
    console.log('Group:', lesson.group);

    return {
      //...lesson,
      id: lesson.id,
      group: [
        {
          group_id: lesson.group.id,
          flow: lesson.group.flow,
          speciality: lesson.group.specialty,
          number: lesson.group.number,
          subgroup: lesson.group.subgroup, // Assuming you pick the first subgroup
        },
      ],
      subject: {
        sub_id: lesson.subject.id,
        name: lesson.subject.name,
      },
      type: lesson.type.name,
      length: lesson.length.name,
      teacher: lesson.teacher.id,
    };
  };

  const renderPage = () => {
    switch (currentPage) {
      // case 'teachersTime':
      //   return (
      //     selectedTeacher && (

      //     )
      //   );

      case 'teachersList':
        return (
          <TeachersList
            teachers={teachers}
            addTeacher={addTeacher}
            deleteTeacher={deleteTeacher}
            onEditSchedule={setSelectedTeacher}
            onOpenClick={() => setIsTimeModalOpen(true)}
          />
        );
      case 'groupsList':
        return <GroupsList />;
      case 'lessonsList':
        return (
          // <TableLoader/>
          <LessonsList
            lessonsLst={lessonsLst}
            teachers={teachers}
            onAddClick={() => {
              setIsModalOpen(true);
              setIsEditMode(false);
            }}
            onEditClick={(lesson) => {
              setSelectedLesson(lesson);
              setIsEditMode(true);
              setIsModalOpen(true);
            }}
            onDeleteClick={(lessonId) => deleteLesson(lessonId)}
          />
        );
      case 'scheduleGenerator':
        return <ScheduleGenerator />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header onNavChange={setCurrentPage} />
      <div className={styles.container}>
        {isLoading ? <TableLoader /> : renderPage()}
        <AddLessonForm
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLesson(null);
          }}
          onSubmit={isEditMode ? updateLesson : addLesson}
          groups={groups}
          subjects={subjects}
          teachers={teachers}
          types={typeOfLessons}
          len={lengthOfLessons}
          initialData={selectedLesson}
        />
        <TeachersTime
          isOpen={isTimeModalOpen}
          teacher={selectedTeacher}
          onSaveSchedule={(schedule) => {
            if (selectedTeacher) {
              updateTeacherSchedule(selectedTeacher.id, schedule);
              setSelectedTeacher(null);
            }
            setIsTimeModalOpen(false);
          }}
          onCancel={() => {
            setSelectedTeacher(null);
            setIsTimeModalOpen(false);
          }}
        />
      </div>
    </>
  );
}

export default App;
