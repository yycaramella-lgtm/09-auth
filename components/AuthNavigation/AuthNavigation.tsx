'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './AuthNavigation.module.css';

const AuthNavigation = () => {
  const router = useRouter();

  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(
    state => state.isAuthenticated,
  );
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Even if the server request fails, clear the local auth state.
    } finally {
      clearIsAuthenticated();
      router.push('/sign-in');
      router.refresh();
    }
  };

  if (isAuthenticated && user) {
    return (
      <ul className={css.navigation}>
        <li>
          <span className={css.userEmail}>
            {user.email || user.username}
          </span>
        </li>

        <li>
          <Link href="/">Home</Link>
        </li>

        <li>
          <Link href="/notes/filter/all">Notes</Link>
        </li>

        <li>
          <Link href="/profile">Profile</Link>
        </li>

        <li>
          <button
            className={css.logoutButton}
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
    );
  }

  return (
    <ul className={css.navigation}>
      <li>
        <Link href="/">Home</Link>
      </li>

      <li>
        <Link href="/notes/filter/all">Notes</Link>
      </li>

      <li>
        <Link href="/sign-in">Login</Link>
      </li>

      <li>
        <Link href="/sign-up">Register</Link>
      </li>
    </ul>
  );
};

export default AuthNavigation;