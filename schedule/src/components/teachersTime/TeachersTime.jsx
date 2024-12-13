import { useState, useEffect } from 'react';
import './TeacherWorktimeEditor.css';
import ReactModal from 'react-modal';

const TeachersTime = ({ teacher, onSaveSchedule, onCancel, isOpen }) => {
  const days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const times = [
    '9:00 - 10:20',
    '10:30 - 11:50',
    '12:00 - 13:20',
    '13:50 - 15:10',
    '15:20 - 16:40',
    '17:00 - 18:20',
    '18:30 - 19:50',
  ];

  const [schedule, setSchedule] = useState(Array(7).fill([]));

  useEffect(() => {
    if (teacher && teacher.schedule) {
      setSchedule(teacher.schedule);
    }
  }, [teacher]);

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
    onSaveSchedule(schedule);
    onCancel(); // Закрыть модальное окно после сохранения
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onCancel}
      overlayClassName="modal__overlay"
      className="teacher-worktime-form"
      ariaHideApp={false}>
      <div className="teacher-worktime-form-title">
        <h2 className="teacher-worktime-form-title__text">
          Назначение времени доступности преподавателя: {teacher?.name || 'Не выбран'}
        </h2>
      </div>
      <table className="teacher-worktime-form-table">
        <thead className="teacher-worktime-form-table-head">
          <tr className="teacher-worktime-form-table-head-row">
            <th>Время</th>
            {days.map((day) => (
              <th className="teacher-worktime-form-table-head-ceil" key={day}>
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
                    checked={schedule[timeIndex]?.includes(dayIndex) || false}
                    onChange={() => handleCheckboxChange(dayIndex, timeIndex)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="btn__wrapper">
        <button className="teacher-worktime-form-submit" onClick={handleSave}>
          Сохранить
        </button>
        <button className="teacher-worktime-form-submit" onClick={onCancel}>
          Отмена
        </button>
      </div>
    </ReactModal>
  );
};

export default TeachersTime;
