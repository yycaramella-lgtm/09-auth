'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';

import { login, type LoginRequest } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

import css from './page.module.css';

type ApiErrorResponse = {
  error?: string;
  message?: string;
};

const SignIn = () => {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError('');
    setIsLoading(true);

    try {
      const formValues: LoginRequest = {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
      };

      const user = await login(formValues);

      setUser(user);
      router.push('/profile');
    } catch (error) {
      const apiError = error as AxiosError<ApiErrorResponse>;

      setError(
        apiError.response?.data?.error ??
          apiError.response?.data?.message ??
          apiError.message ??
          'Unable to sign in',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={css.container}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.title}>Sign in</h1>

        <label className={css.label}>
          Email
          <input
            className={css.input}
            type="email"
            name="email"
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
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className={css.submitButton}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        {error && (
          <p className={css.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
};

export default SignIn;