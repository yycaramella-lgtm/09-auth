'use client';

import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';
import Link from 'next/link';

import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';

import css from '@/components/Notes/Notes.module.css';

type Props = {
  tag?: string;
};

const NotesClient = ({ tag }: Props) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['notes', { page, search, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 12,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
  });

  const handleSearch = useDebouncedCallback(
    (value: string) => {
      setPage(1);
      setSearch(value);
    },
    300,
  );

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={event =>
            handleSearch(event.target.value)
          }
        />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link
          className={css.button}
          href="/notes/action/create"
        >
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading notes...</p>}

      {isFetching && !isLoading && (
        <p>Updating notes...</p>
      )}

      {isError && <p>Error: {error.message}</p>}

      {data && <NoteList notes={data.notes} />}
    </main>
  );
};

export default NotesClient;