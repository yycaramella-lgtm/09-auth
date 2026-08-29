import { cookies } from 'next/headers';

import { api } from './api';

import type { Note } from '@/types/note';
import type { User } from '@/types/user';

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
};

export const checkServerSession = async () => {
  const cookieHeader = await getCookieHeader();

  return api.get('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });
};

export const fetchNoteById = async (
  id: string,
): Promise<Note> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const getServerMe = async (): Promise<User> => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};

export const fetchNotes = async (params?: {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}) => {
  const cookieHeader = await getCookieHeader();

  const response = await api.get<{
    notes: Note[];
    totalPages: number;
  }>('/notes', {
    params,
    headers: {
      Cookie: cookieHeader,
    },
  });

  return response.data;
};