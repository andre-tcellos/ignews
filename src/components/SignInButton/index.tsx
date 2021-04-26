import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';
import styles from './styles.module.scss';

export function SignInButton() {
    const [session] = useSession();

    return session ? (
        <button type="button" className={styles.signInButton} onClick={() => signOut()}>
            <FaGithub className={styles.loggedIn} />
            <span>{session.user.name}</span>
            <FiX />
        </button>
    ) : (
        <button type="button" className={styles.signInButton} onClick={() => signIn('github')}>
            <FaGithub className={styles.loggedOut} />
            <span>Sing in with Github</span>
        </button>
    );
};