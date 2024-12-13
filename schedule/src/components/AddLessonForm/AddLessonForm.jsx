import { useState, useEffect } from 'react';
import styles from './AddLessonForm.module.css';
import Select from './Select';
import ReactModal from 'react-modal';

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
            //multiple={true}
            onSelect={(value) => handleChange('group', value)}
          />
        </div>
        {/* Subject */}
        <div className={styles.select__wrapper}>
          <label>Предмет</label>
          <Select
            options={subjects}
            value={formData.subject}
            onSelect={(value) => handleChange('subject', value)}
          />
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
