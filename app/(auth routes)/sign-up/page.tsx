'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import css from './page.module.css';

import {
  register,
  type RegisterRequest,
} from '@/lib/api/clientApi';

import { useAuthStore } from '@/lib/store/authStore';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const SignUp = () => {
  const router = useRouter();

  const setUser = useAuthStore(
    state => state.setUser,
  );

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');
    setIsLoading(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data: RegisterRequest = {
      email: String(
        formData.get('email') ?? '',
      ).trim(),
      password: String(
        formData.get('password') ?? '',
      ),
    };

    try {
      const user = await register(data);

      if (user) {
        setUser(user);
        router.push('/profile');
        router.refresh();
      }
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        setError(
          error.response?.data?.error ??
            error.response?.data?.message ??
            error.message ??
            'Registration failed',
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : 'Registration failed',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={css.container}>
      <div className={css.formWrapper}>
        <h1 className={css.title}>Sign up</h1>

        <form
          className={css.form}
          onSubmit={handleSubmit}
        >
          <label className={css.label}>
            Email
            <input
              className={css.input}
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </label>

          <label className={css.label}>
            Password
            <input
              className={css.input}
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </label>

          <button
            className={css.button}
            type="submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Creating account...'
              : 'Register'}
          </button>

          {error && (
            <p
              className={css.error}
              role="alert"
            >
              {error}
            </p>
          )}
        </form>
      </div>
    </main>
  );
};

export default SignUp;