import LoginPage from '../login_page';
import MainPage from '../main_page';
import styles from './styles.module.css';
import { useAuth } from '../avrp_auth_context';

export default function PageContainer() {
  const { user } = useAuth();

  return (
    <div className={styles.pageContainer}>
      { user ? (<MainPage />) : (<LoginPage />) }
    </div>
  )
}