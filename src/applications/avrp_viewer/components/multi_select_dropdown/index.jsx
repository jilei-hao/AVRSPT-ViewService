import React, { useState } from 'react';
import styles from './styles.module.css';

export default function MultiSelectDropdown({ options, selectedOptions, onOptionsChange, menuTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    console.log("toggleDropdown");
  }

  const handleOptionClick = (event) => {
    const value = event.target.value;
    const isSelected = selectedOptions.includes(value);
    if (isSelected) {
      onOptionsChange(selectedOptions.filter(option => option !== value));
    } else {
      onOptionsChange([...selectedOptions, value]);
    }
  };

  return (
    <div className={ styles.dropdown }>
      <button className={ styles.dropdownButton } onClick={ toggleDropdown }>
        {menuTitle ? menuTitle : "Select ..."}
      </button>
      {isOpen && (
        <div className={ styles.dropdownMenu }>
          {options.map((option, index) => (
            <div key={index} className={ styles.dropdownItem }>
              <label>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
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