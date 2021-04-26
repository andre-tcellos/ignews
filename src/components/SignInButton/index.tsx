import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import styles from './styles.module.scss';

export function SignInButton() {
    const isUserLoggedIn = false;

    return isUserLoggedIn ? (
        <button type="button" className={styles.signInButton}>
            <FaGithub className={styles.loggedIn} />
            <span>André Vasconcellos</span>
            <FiX />
        </button>
    ) : (
        <button type="button" className={styles.signInButton}>
            <FaGithub className={styles.loggedOut} />
            <span>Sing in with Github</span>
        </button>
    );
};