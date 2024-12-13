//import React from "react";
import { useAppContext } from '../../AppContextProvider';

function GroupsDisplay() {
  const { groupsToLessons, teachers } = useAppContext();
  console.log('Groups: ', groupsToLessons);
  console.log('Teachers: ', teachers);

  return (
    <div>
      <h1>Component GroupsDisplay</h1>
      <h3>Groups To Lessons</h3>
      <ul>
        {groupsToLessons.map((lesson) => (
          <div key={lesson.name}>{lesson.name}</div>
        ))}
      </ul>
      <h3>Teachers</h3>
      <ul>
        {teachers.map((teacher) => (
          <div key={teacher.name}>{teacher.name}</div>
        ))}
      </ul>
    </div>
  );
}

export default GroupsDisplay;
