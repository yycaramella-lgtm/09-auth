import axios from 'axios';

const baseURL = 'https://notehub-public.goit.study/api';

export const api = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});