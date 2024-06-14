import React, { useState } from 'react';
import styles from './styles.module.css';

export default function SingleSelectDropdown({ options, selectedOption, onOptionChange, menuTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  }

  const handleOptionClick = (event) => {
    const value = event.target.value;
    onOptionChange(value);
    setIsOpen(false);
  };

  return (
    <div className={ styles.dropdown }>
      <button className={ styles.dropdownButton } onClick={ toggleDropdown }>
        {selectedOption ? selectedOption : (menuTitle ? menuTitle : "Select ...")}
      </button>
      {isOpen && (
        <div className={ styles.dropdownMenu }>
          {options.map((option, index) => (
            <div key={index} className={ styles.dropdownItem }>
              <label>
                <input
                  type="radio"
                  value={option}
                  checked={selectedOption === option}
                  onChange={handleOptionClick}
                />
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
