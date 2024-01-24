import { Link } from 'react-router-dom';
import '../Header.css';
import LogoutButton from './logout-button.component';

/**
 * Represents the header component.
 * @returns {JSX.Element} The rendered header component.
 */
export const Header = (): JSX.Element => {
  return (
    <div id="header" className="peripheral">
      <Link to="/" id="title">GoGetter</Link>
      <LogoutButton />
    </div>
  );
};