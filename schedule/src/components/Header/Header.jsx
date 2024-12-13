import styles from './Header.module.css';

const Header = ({ onNavChange }) => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <a className={styles.logo} href="https://rct.bsu.by/faculty">
          <div className={styles.logo__wrapper}>
            {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 296.72 240">
                <g id="Layer_2" data-name="Layer 2">
                  <g id="\u0421\u043B\u043E\u0439_1" data-name="\u0421\u043B\u043E\u0439 1">
                    <path d="m295.51 109.23-22.9-11.44a.78.78 0 0 0-.37-.09h-50a.83.83 0 0 0-.59.25l-44.38 44.38h-56.83a.83.83 0 0 0-.74.46l-48.38 96.75a.83.83 0 0 1-1.57-.38v-39.67a.84.84 0 0 0-.84-.83H49.39a.83.83 0 0 1-.66-1.33l65-86.7.08-.09 27.48-27.48a.83.83 0 0 0-.59-1.42h-26.33a.84.84 0 0 1-.83-.84V57a.83.83 0 0 0-.83-.83H50.64a.83.83 0 0 1-.83-.83V31.48a.84.84 0 0 0-.84-.83H.83a.83.83 0 0 1-.59-1.42L24.07 5.4a.82.82 0 0 1 .59-.24H116a9.2 9.2 0 0 1 17.47 4.05 9.1 9.1 0 0 1-1.3 4.71l30.77 46.15a.83.83 0 0 0 1.28.13L177 47.34a.85.85 0 0 1 .59-.24h81.82a.87.87 0 0 1 .59.24l12.19 12.16a.83.83 0 0 1 .25.59v12a.83.83 0 0 0 .24.58L285 85a.65.65 0 0 1 .16.21l11.47 22.94a.83.83 0 0 1-1.12 1.08Z"></path>
                    <path d="M177.27 155.63v-13.3h12.82a.83.83 0 0 1 .83.83v12.47a.85.85 0 0 1-.24.59l-13.16 13.15a.83.83 0 0 1-.59.25h-11.29a.83.83 0 0 1-.59-1.42l12-12a.81.81 0 0 0 .22-.57Z"></path>
                  </g>
                </g>
              </svg>
            }
          </div>
        </a>

        <div className={styles.header__btns}>
          <button className={styles.button} onClick={() => onNavChange('groupsList')}>
            Список групп
          </button>
          <button className={styles.button} onClick={() => onNavChange('teachersList')}>
            Список преподавателей
          </button>
          <button className={styles.button} onClick={() => onNavChange('lessonsList')}>
            Список занятий
          </button>
          <button className={styles.button} onClick={() => onNavChange('scheduleGenerator')}>
            Генерация расписания
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
