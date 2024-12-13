import styles from './LessonsList.module.css';
import { TiDelete } from 'react-icons/ti';
import { GrEdit } from 'react-icons/gr';

const LessonsList = ({ lessonsLst, onAddClick, onEditClick, onDeleteClick, teachers }) => {
  // Проверяем, что teachers не пустой массив
  const getTeacherName = (id) => {
    if (!Array.isArray(teachers)) return 'Неизвестно'; // Если teachers отсутствует или не массив
    return teachers.find((teacher) => teacher.id === id)?.name || 'Неизвестно';
  };

  return (
    <div className={styles.lessons__box}>
      <h2>Список занятий</h2>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.thead__tr}>
            <th className={styles.thead__th}>Группа</th>
            <th className={styles.thead__th}>Предмет</th>
            <th className={styles.thead__th}>Тип занятия</th>
            <th className={styles.thead__th}>Длительность</th>
            <th className={styles.thead__th}>Преподаватель</th>
            <th className={styles.thead__th}></th>
          </tr>
        </thead>
        <tbody>
          {lessonsLst.map((lesson) => (
            <tr className={styles.tbody_tr} key={lesson.id}>
              <td className={styles.tbody_td}>
                {lesson.group
                  .map(
                    (group) =>
                      `${group.flow}-${group.speciality}-${group.number} (подгр. ${group.subgroup})`,
                  )
                  .join(', ')}
              </td>
              <td className={styles.tbody_td}>{lesson.subject.name}</td>
              <td className={styles.tbody_td}>{lesson.type}</td>
              <td className={styles.tbody_td}>{lesson.length}</td>
              <td className={styles.tbody_td}>{getTeacherName(lesson.teacher)}</td>
              <td className={styles.tbody_td}>
                <button className={styles.action__btn} onClick={() => onEditClick(lesson)}>
                  <GrEdit size={20} color="#0a3470" />
                </button>
                <button className={styles.action__btn} onClick={() => onDeleteClick(lesson.id)}>
                  <TiDelete size={20} color="#0a3470" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.btn_wrapper}>
        <button className={styles.btn} onClick={onAddClick}>
          Добавить
        </button>
      </div>
    </div>
  );
};

export default LessonsList;
