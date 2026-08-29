export {
  register,
  login,
  logout,
  checkSession,
  getMe,
  updateMe,
  fetchNotes,
  fetchNoteById,
  createNote,
  deleteNote,
} from './clientApi';

export type {
  RegisterRequest,
  LoginRequest,
  FetchNotesParams,
  FetchNotesResponse,
  CreateNoteData,
  UpdateUserData,
} from './clientApi';