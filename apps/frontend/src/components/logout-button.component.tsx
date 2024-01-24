import { useAuthContext } from '../contexts/authentication.context.ts';

const LogoutButton = () => {
  const authContextData = useAuthContext()!;

  if (!authContextData || !authContextData.token) {
    return null;
  }

  return (
    <button id="logout" onClick={authContextData.logOut}>Logout</button>
  );
};

export default LogoutButton;