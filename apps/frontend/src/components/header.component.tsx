import { Link } from 'react-router-dom';
import '../Header.css';

export const Header = () => {
  return (
    <div id="header">
      <Link to="/" id="title">GoGetter</Link>
    </div>
  );
};