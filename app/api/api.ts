import axios from 'axios';

export interface ApiError {
  message: string;
  status?: number;
}

const baseURL = 'https://notehub-api.goit.study';

export const api = axios.create({
  baseURL,
  withCredentials: true,
});