'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { createNote } from '@/lib/api';
import type { NoteTag } from '@/types/note';
import { useNoteStore } from '@/lib/store/noteStore';

import css from './NoteForm.module.css';

const NoteForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const createMutation = useMutation({
    mutationFn: createNote,

    onSuccess: async () => {
      clearDraft();

      await queryClient.invalidateQueries({
        queryKey: ['notes'],
      });

      router.push('/notes/filter/all');
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setDraft({
      ...draft,
      [name]: value,
    });
  };

  const handleSubmit = (formData: FormData) => {
    const title = String(formData.get('title') ?? '').trim();
    const content = String(formData.get('content') ?? '').trim();
    const tag = formData.get('tag') as NoteTag;

    if (title.length < 3 || title.length > 50) {
      return;
    }

    if (content.length > 500) {
      return;
    }

    createMutation.mutate({
      title,
      content,
      tag,
    });
  };

  const handleCancel = () => {
    router.push('/notes/filter/all');
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.field}>
        <label htmlFor="note-title">Title</label>

        <input
          id="note-title"
          type="text"
          name="title"
          placeholder="Enter note title"
          required
          minLength={3}
          maxLength={50}
          defaultValue={draft.title}
          onChange={handleChange}
          disabled={createMutation.isPending}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="note-content">Content</label>

        <textarea
          id="note-content"
          name="content"
          placeholder="Enter note content"
          rows={6}
          maxLength={500}
          defaultValue={draft.content}
          onChange={handleChange}
          disabled={createMutation.isPending}
        />
      </div>

      <div className={css.field}>
        <label htmlFor="note-tag">Tag</label>

        <select
          id="note-tag"
          name="tag"
          required
          defaultValue={draft.tag}
          onChange={handleChange}
          disabled={createMutation.isPending}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      {createMutation.isError && (
        <span className={css.error}>Failed to create note.</span>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;