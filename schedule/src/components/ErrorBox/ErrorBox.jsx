import styles from './ErrorBox.module.css';
import ReactModal from 'react-modal';

const ErrorBox = ({ message, isOpen, onClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName={styles.modal__overlay}
      className={styles.error_box}
      ariaHideApp={false}>
      <h2 className={styles.title}>Ошибка</h2>
      <p className={styles.error__message}>{message}</p>
      <button onClick={() => onClose()} className={styles.btn}>
        Ok
      </button>
    </ReactModal>
  );
};

export default ErrorBox;
