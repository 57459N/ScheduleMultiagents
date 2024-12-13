import { useState } from 'react';
import './TeacherEditor.css';

function TeacherList({ teachers, addTeacher, deleteTeacher, onEditSchedule, onOpenClick }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');

  const handleAddTeacher = async () => {
    if (!newTeacherName.trim()) {
      alert('Введите имя преподавателя.');
      return;
    }

    const newTeacher = { name: newTeacherName.trim(), schedule: Array(7).fill([]) };
    try {
      await addTeacher(newTeacher);
      setNewTeacherName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Ошибка при добавлении преподавателя:', error);
    }
  };

  return (
    <div className="teacher-list">
      <h2 className="teacher-list__title">Список преподавателей</h2>
      <div className="teacher-list-content">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-list__item">
            {teacher.name}
            <button
              onClick={() => {
                onEditSchedule(teacher);
                onOpenClick(); // Исправлено: вызов onOpenClick для открытия модального окна
              }}
              className="teacher-list-buttons-btn">
              Время
            </button>
          </div>
        ))}
        {isAdding && (
          <div className="teacher-list__item adding">
            <input
              type="text"
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
              placeholder="Введите имя"
              className="teacher-list__item-input"
            />
            <button className="teacher-list__item-btn" onClick={handleAddTeacher}>
              ✔
            </button>
          </div>
        )}
      </div>
      <div className="teacher-list-buttons">
        <button className="teacher-list-buttons-btn" onClick={() => setIsAdding(true)}>
          Добавить
        </button>
        <button className="teacher-list-buttons-btn" onClick={deleteTeacher}>
          Удалить
        </button>
      </div>
    </div>
  );
}

export default TeacherList;
