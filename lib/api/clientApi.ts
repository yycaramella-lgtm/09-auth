import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';
import type { User } from '@/types/user';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface UpdateUserData {
  username: string;
}

export type ApiError = {
  message?: string;
  response?: {
    data?: {
      error?: string;
      message?: string;
    };
    status?: number;
  };
};

export const register = async (
  data: RegisterRequest,
): Promise<User> => {
  const response = await api.post<User>('/auth/register', data);

  return response.data;
};

export const login = async (
  data: LoginRequest,
): Promise<User> => {
  const response = await api.post<User>('/auth/login', data);

  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const response = await api.get<User | null>('/auth/session');

    return response.status === 200;
  } catch {
    return false;
  }
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>('/users/me');

  return response.data;
};

export const updateMe = async (
  data: UpdateUserData,
): Promise<User> => {
  const response = await api.patch<User>('/users/me', data);

  return response.data;
};

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });

  return response.data;
};

export const fetchNoteById = async (
  id: string,
): Promise<Note> => {
  const response = await api.get<Note>(`/notes/${id}`);

  return response.data;
};

export const createNote = async (
  note: CreateNoteData,
): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);

  return response.data;
};

export const deleteNote = async (
  id: string,
): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);

  return response.data;
};