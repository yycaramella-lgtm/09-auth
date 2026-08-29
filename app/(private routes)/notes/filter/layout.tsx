import type { ReactNode } from 'react';
import css from './LayoutNotes.module.css';

type Props = {
  children: ReactNode;
  sidebar: ReactNode;
};

const FilterLayout = ({ children, sidebar }: Props) => {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>{sidebar}</aside>
      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
};

export default FilterLayout;