import styles from './LessonsList.module.css';
const LessonTR = ({ Group, Subject, Type, Length, Teacher }) => {
  return (
    <tr className={styles.tbody_tr}>
      <td className={styles.tbody_td}>{Group}</td>
      <td className={styles.tbody_td}>{Subject}</td>
      <td className={styles.tbody_td}>{Type}</td>
      <td className={styles.tbody_td}>{Length}</td>
      <td className={styles.tbody_td}>{Teacher}</td>
    </tr>
  );
};

export default LessonTR;
