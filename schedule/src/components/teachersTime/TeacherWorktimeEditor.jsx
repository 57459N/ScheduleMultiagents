import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './TeacherWorktimeEditor.css';
import { useAppContext } from '../../AppContextProvider.jsx';

const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const times = [
  '9:00 - 10:20',
  '10:30 - 11:50',
  '12:00 - 13:20',
  '13:50 - 15:10',
  '15:20 - 16:40',
  '17:00 - 18:20',
  '18:30 - 19:50',
  '20:00 - 21:20',
];

function TeacherWorktimeForm() {
  const { teachers, updateTeacherSchedule } = useAppContext();
  // const navigate = useNavigate();
  // const location = useLocation();
  const { id } = useParams();

  const teacherFromState = location.state?.teacher;

  const teacher = teacherFromState || teachers.find((t) => t.id === parseInt(id, 10));
  console.log(teacher);

  const [schedule, setSchedule] = useState(Array(times.length).fill([]));

  useEffect(() => {
    if (teacher && teacher.schedule) {
      setSchedule(teacher.schedule);
    }
  }, [teacher]);

  if (!teacher) {
    return <p>Преподаватель не найден!</p>;
  }

  const handleCheckboxChange = (dayIndex, timeIndex) => {
    const updatedSchedule = [...schedule];
    const selectedDays = updatedSchedule[timeIndex];

    if (selectedDays.includes(dayIndex)) {
      updatedSchedule[timeIndex] = selectedDays.filter((index) => index !== dayIndex);
    } else {
      updatedSchedule[timeIndex] = [...selectedDays, dayIndex];
    }

    setSchedule(updatedSchedule);
  };

  const handleSave = () => {
    updateTeacherSchedule(teacher.id, schedule);
    // navigate('/');
  };

  const handleSelectAll = (dayIndex) => {
    const newSchedule = [...schedule];
    for (let i = 0; i < times.length; i++) {
      if (!newSchedule[i].includes(dayIndex)) {
        newSchedule[i].push(dayIndex);
      }
    }
    setSchedule(newSchedule);
  };

  const handleDeselectAll = (dayIndex) => {
    const newSchedule = [...schedule];
    for (let i = 0; i < times.length; i++) {
      newSchedule[i] = newSchedule[i].filter((index) => index !== dayIndex);
    }
    setSchedule(newSchedule);
  };

  return (
    <div className="teacher-worktime-form">
      <div className="teacher-worktime-form-title">
        <p className="teacher-worktime-form-title__text">
          Назначение времени доступности преподавателя: {teacher.name}
        </p>
      </div>

      <table className="teacher-worktime-form-table">
        <thead className="teacher-worktime-form-table-head">
          <tr className="teacher-worktime-form-table-head-row">
            <th></th>
            {days.map((day, index) => (
              <th className="teacher-worktime-form-table-head-ceil" key={index}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="teacher-worktime-form-table-body">
          {times.map((time, timeIndex) => (
            <tr key={timeIndex}>
              <td className="teacher-worktime-form-table-body-ceil">{time}</td>
              {days.map((_, dayIndex) => (
                <td className="teacher-worktime-form-table-body-ceil-with-input" key={dayIndex}>
                  <input
                    type="checkbox"
                    checked={schedule[timeIndex].includes(dayIndex)}
                    onChange={() => handleCheckboxChange(dayIndex, timeIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
          <tr className="teacher-worktime-form-table-body-row">
            <td className="teacher-worktime-form-table-body-ceil-all">Выбрать все</td>
            {days.map((_, dayIndex) => (
              <td key={dayIndex}>
                <button
                  className="teacher-worktime-form-table-body-btn"
                  onClick={() => handleSelectAll(dayIndex)}>
                  ✔
                </button>
              </td>
            ))}
          </tr>
          <tr className="teacher-worktime-form-table-body-row">
            <td className="teacher-worktime-form-table-body-ceil-all">Убрать все</td>
            {days.map((_, dayIndex) => (
              <td key={dayIndex}>
                <button
                  className="teacher-worktime-form-table-body-btn"
                  onClick={() => handleDeselectAll(dayIndex)}>
                  ✘
                </button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <button className="teacher-worktime-form-submit" onClick={handleSave}>
        Сохранить
      </button>
    </div>
  );
}

export default TeacherWorktimeForm;
