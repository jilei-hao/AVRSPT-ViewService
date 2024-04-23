import { useAuth } from '../avrp_auth_context';
import React, { useState } from 'react';
import styles from './styles.module.css';

export default function LoginPage() {
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Make a POST request to your backend API to create a new user
    login(formData);
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.loginHeader}>
          Welcome to AVRP Terminal! Please login.
        </div>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            autoComplete='on'
            placeholder='Username'
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            autoComplete='on'
            placeholder='Password'
          />
        </div>
        <div>
          <input 
            type="submit" 
            value="Login"
          />
        </div>
      </form>
      
    </div>
  );
}