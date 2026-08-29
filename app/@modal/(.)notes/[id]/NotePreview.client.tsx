'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchNoteById } from '@/lib/api/clientApi';
import Modal from '@/components/Modal/Modal';

const NotePreviewClient = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <main>
        <div>
          <div>
            <h2>{note.title}</h2>
          </div>

          <p>{note.tag}</p>

          <p>{note.content}</p>

          <p>{new Date(note.createdAt).toLocaleString()}</p>
        </div>
      </main>
    </Modal>
  );
};

export default NotePreviewClient;