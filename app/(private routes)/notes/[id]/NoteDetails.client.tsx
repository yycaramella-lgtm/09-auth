'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api/clientApi';

const NoteDetailsClient = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main>
      <div>
        <div>
          <div>
            <h2>{note.title}</h2>
          </div>

          <p>{note.tag}</p>

          <p>{note.content}</p>

          <p>
            {new Date(
              note.createdAt,
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </main>
  );
};

export default NoteDetailsClient;