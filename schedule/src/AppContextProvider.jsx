import { createContext, useContext, useState } from 'react';
import data from './previewData';

const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = ({ children }) => {
  const [groupsToLessons, setGroupsToLessons] = useState(data.groupsToLessons || []);
  const [teachers, setTeachers] = useState(data.teachers || []);

  const addTeacher = (teacher) => {
    setTeachers((prev) => {
      const updatedTeachers = [...prev, teacher];
      data.teachers = updatedTeachers;
      return updatedTeachers;
    });
  };

  const deleteTeacher = (teacherId) => {
    setTeachers((prev) => {
      const updatedTeachers = prev.filter((teacher) => teacher.id !== teacherId);
      data.teachers = updatedTeachers;
      return updatedTeachers;
    });
  };

  const updateTeacherSchedule = (teacherId, schedule) => {
    setTeachers((prev) =>
      prev.map((teacher) => (teacher.id === teacherId ? { ...teacher, schedule } : teacher)),
    );
  };

  return (
    <AppContext.Provider
      value={{
        groupsToLessons,
        setGroupsToLessons,
        teachers,
        addTeacher,
        deleteTeacher,
        updateTeacherSchedule,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
