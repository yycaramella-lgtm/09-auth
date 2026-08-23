'use client';

interface NotesErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

const NotesError = ({ error }: NotesErrorProps) => {
  return (
    <p>
      Could not fetch the list of notes. {error.message}
    </p>
  );
};

export default NotesError;