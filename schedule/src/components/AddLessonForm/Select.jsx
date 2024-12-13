import { useState } from 'react';
import styles from './Select.module.css';

const Select = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option); // Передаём выбранный элемент в родительский компонент
  };

  return (
    <div className={styles.select}>
      <div className={styles.select__box} onClick={() => setShowOptions((prev) => !prev)}>
        {selectedOption ? selectedOption.name : 'Выберите'}
        <span className={`${styles.arrow} ${showOptions ? styles.arrow__up : ''}`}>&#9660;</span>
      </div>
      {showOptions && (
        <div className={styles.options}>
          {options.map((option) => (
            <div
              key={option.id}
              className={`${styles.option} ${
                selectedOption?.id === option.id ? styles.option__selected : ''
              }`}
              onClick={() => handleSelect(option)}>
              {option.name}
              {selectedOption?.id === option.id && (
                <span className={styles.checkmark}>&#10003;</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
