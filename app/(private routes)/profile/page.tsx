import type { Metadata } from 'next';
import Link from 'next/link';

import { getServerMe } from '@/lib/api/serverApi';

import css from './page.module.css';

export const metadata: Metadata = {
  title: 'Profile | NoteHub',
  description: 'Your NoteHub profile',
};

const Profile = async () => {
  const user = await getServerMe();

  return (
    <section className={css.container}>
      <div className={css.header}>
        <h1 className={css.title}>My Profile</h1>

        <Link
          className={css.editButton}
          href="/profile/edit"
        >
          Edit profile
        </Link>
      </div>

      <div className={css.profile}>
        <div className={css.avatar}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.username}'s avatar`}
            />
          ) : (
            <span>
              {user.username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div className={css.info}>
          <h2 className={css.username}>
            {user.username}
          </h2>

          <p className={css.email}>{user.email}</p>

          <p className={css.description}>
            Welcome to your NoteHub profile. Here you can
            manage your personal information and notes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Profile;