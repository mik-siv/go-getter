import { Link } from 'react-router-dom';
import '../Header.css';

export const Header = () => {
  return (
    <div id="header" className='peripheral'>
      <Link to="/" id="title">GoGetter</Link>
    </div>
  );
};