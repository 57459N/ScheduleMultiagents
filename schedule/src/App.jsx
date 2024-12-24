// Import dependencies
import { useState, useEffect } from 'react';
import Header from './components/Header/Header';
import LessonsList from './components/LessonsList/LessonsList';
import AddLessonForm from './components/AddLessonForm/AddLessonForm';
import ScheduleGenerator from './components/ScheduleGenerator/ScheduleGenerator';
import TeachersList from './components/TeachersList/TeachersList';
import TeachersTime from './components/teachersTime/TeachersTime';
import GroupsList from './components/GroupsList/GroupsList';
import styles from './App.module.css';
import { typeOfLessons, lengthOfLessons } from './data/data';
import TableLoader from './components/TableLoader/TableLoader';

const LESSONS_API = 'https://6704e89a031fd46a830ddca4.mockapi.io/lessons';
const TEACHERS_API = 'https://6704e89a031fd46a830ddca4.mockapi.io/teachers';
const GROUPS_API = 'https://67691307cbf3d7cefd397d7f.mockapi.io/schedule/groups';
const SUBJECTS_API = 'https://67691307cbf3d7cefd397d7f.mockapi.io/schedule/subjects';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('lessonsList');
  const [lessonsLst, setLessonsLst] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Fetch initial data
  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [lessonsRes, teachersRes, groupsRes, subjectsRes] = await Promise.all([
          fetch(LESSONS_API),
          fetch(TEACHERS_API),
          fetch(GROUPS_API),
          fetch(SUBJECTS_API),
        ]);

        const lessonsData = await lessonsRes.json();
        const teachersData = await teachersRes.json();
        const groupsData = await groupsRes.json();
        const subjectsData = await subjectsRes.json();

        setLessonsLst(lessonsData);
        setTeachers(teachersData);
        setGroups(groupsData);
        setSubjects(subjectsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a new lesson
  const addLesson = async (newLesson) => {
    try {
      const lessonToSend = formatLessonDataForApi(newLesson);
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

  const formatLessonDataForApi = (lesson) => {
    return {
      id: lesson.id,
      group: [
        {
          group_id: lesson.group.id,
          flow: lesson.group.flow,
          speciality: lesson.group.specialty,
          number: lesson.group.number,
          subgroup: lesson.group.subgroup,
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
