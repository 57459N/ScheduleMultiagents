import styles from './ScheduleGenerator.module.css';

const ScheduleGenerator = () => {
  return (
    <div className={styles.generator}>
      <h2 className={styles.title}>Запуск генерации расписания</h2>
      <div className={styles.generator__wrapper}>
        <div className={styles.input__wrapper}>
          <p className={styles.input__title}>Работать до получения оценки</p>
          <input className={styles.input} type="text" />
        </div>
        <div className={styles.input__wrapper}>
          <p className={styles.input__title}>Время работы в секундах</p>
          <input className={styles.input} type="text" />
        </div>
        <button className={styles.btn}>Запуск</button>
      </div>
    </div>
  );
};

export default ScheduleGenerator;
