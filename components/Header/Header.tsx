import Link from 'next/link';

import AuthNavigation from '@/components/AuthNavigation/AuthNavigation';

import css from './Header.module.css';

const Header = () => {
  return (
    <header className={css.header}>
      <Link
        className={css.logo}
        href="/"
        aria-label="Home"
      >
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <AuthNavigation />
      </nav>
    </header>
  );
};

export default Header;