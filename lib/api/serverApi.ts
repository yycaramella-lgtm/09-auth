import axios from 'axios';
import { cookies } from 'next/headers';

import type { Note } from '@/types/note';
import type { User } from '@/types/user';

const baseURL = 'https://notehub-api.goit.study';

export const serverApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const getCookieHeader = async (): Promise<string> => {
  const cookieStore = await cookies();

  return cookieStore.toString();
};

serverApi.interceptors.request.use(async config => {
  const cookieHeader = await getCookieHeader();

  if (cookieHeader) {
    config.headers.Cookie = cookieHeader;
  }

  return config;
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const getServerMe = async (): Promise<User> => {
  const response = await serverApi.get<User>('/users/me');

  return response.data;
};

export const checkServerSession = async (): Promise<boolean> => {
  try {
    const response = await serverApi.get('/auth/session');

    return response.status === 200;
  } catch {
    return false;
  }
};

export const fetchServerNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await serverApi.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  const response = await serverApi.get<Note>(`/notes/${id}`);

  return response.data;
};