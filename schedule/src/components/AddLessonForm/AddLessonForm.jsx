import { useState, useEffect } from 'react';
import styles from './AddLessonForm.module.css';
import Select from './Select';
import ReactModal from 'react-modal';

const SUBJECTS_API = 'https://67691307cbf3d7cefd397d7f.mockapi.io/schedule/subjects';

const AddLessonForm = ({
  groups,
  subjects,
  types,
  teachers,
  len,
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    group: [],
    subject: '',
    type: '',
    length: '',
    teacher: '',
  });

  const [subjectsList, setSubjectsList] = useState(subjects);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: initialData?.id || Date.now() });
    setFormData({ group: [], subject: '', type: '', length: '', teacher: '' });
    onClose();
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddSubject = async (newSubject) => {
    try {
      const response = await fetch(SUBJECTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });
      const createdSubject = await response.json();
      setSubjectsList((prev) => [...prev, createdSubject]);
      return createdSubject;
    } catch (err) {
      console.error('Ошибка при добавлении предмета:', err);
      throw err;
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={styles.modal__overlay}
      className={styles.addLesson__box}
      ariaHideApp={false}>
      <h2 className={styles.title}>{initialData ? 'Изменить занятие' : 'Добавить занятие'}</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Group */}
        <div className={styles.select__wrapper}>
          <label>Группы</label>
          <Select
            options={groups}
            value={formData.group}
            onSelect={(value) => handleChange('group', value)}
          />
        </div>
        {/* Subject */}
        <div className={styles.select__wrapper}>
          <label>Предмет</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              value={formData.subject.name || ''}
              onChange={(e) => handleChange('subject', { id: null, name: e.target.value })}
              onBlur={async () => {
                const inputValue = formData.subject.name?.trim();
                if (inputValue && !subjectsList.some((subj) => subj.name === inputValue)) {
                  try {
                    const newSubject = await handleAddSubject({ name: inputValue });
                    handleChange('subject', newSubject);
                  } catch (err) {
                    console.error('Ошибка при добавлении предмета:', err);
                  }
                }
              }}
              placeholder="Введите название предмета"
              className={styles.input}
            />
          </div>
        </div>
        {/* Type */}
        <div className={styles.select__wrapper}>
          <label>Тип занятия</label>
          <Select
            options={types}
            value={formData.type}
            onSelect={(value) => handleChange('type', value)}
          />
        </div>
        {/* Teacher */}
        <div className={styles.select__wrapper}>
          <label>Преподаватель</label>
          <Select
            options={teachers}
            value={formData.teacher}
            onSelect={(value) => handleChange('teacher', value)}
          />
        </div>
        {/* Length */}
        <div className={styles.select__wrapper}>
          <label>Длительность</label>
          <Select
            options={len}
            value={formData.length}
            onSelect={(value) => handleChange('length', value)}
          />
        </div>
        {/* Buttons */}
        <div className={styles.button__wrapper}>
          <button type="submit" className={styles.btn}>
            {initialData ? 'Сохранить изменения' : 'Добавить'}
          </button>
          <button type="button" onClick={onClose} className={styles.btn}>
            Отмена
          </button>
        </div>
      </form>
    </ReactModal>
  );
};

export default AddLessonForm;
