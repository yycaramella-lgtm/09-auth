'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './page.module.css';

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const ProfileEdit = () => {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(
    user?.username ?? '',
  );
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!user) {
      router.push('/sign-in');
      return;
    }

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError('Username is required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const updatedUser = await updateMe({
        username: trimmedUsername,
      });

      setUser(updatedUser);
      router.push('/profile');
      router.refresh();
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;

      setError(
        apiError.response?.data?.error ??
          apiError.response?.data?.message ??
          apiError.message ??
          'Unable to update profile',
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <section className={css.container}>
      <div className={css.profileCard}>
        <h1 className={css.title}>Edit Profile</h1>

        <div className={css.avatarWrapper}>
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatarPlaceholder}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <form
          className={css.profileInfo}
          onSubmit={handleSubmit}
        >
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>

            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              required
            />
          </div>

          <p>Email: {user.email}</p>

          {error && (
            <p className={css.error} role="alert">
              {error}
            </p>
          )}

          <div className={css.actions}>
            <button
              type="submit"
              className={css.saveButton}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>

            <button
              type="button"
              className={css.cancelButton}
              onClick={() => router.push('/profile')}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileEdit;