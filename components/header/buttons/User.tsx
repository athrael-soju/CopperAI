import React from 'react';
import { signOut } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

type Session = {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

interface UserProps {
  session: Session | null | undefined;
}
const User: React.FC<UserProps> = ({ session }) => (
  <div className="flex items-center gap-2">
    <button
      className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
      onClick={(e) => {
        e.preventDefault();
        signOut();
      }}
      title="Sign out"
    >
      <FontAwesomeIcon icon={faSignOutAlt} />
    </button>
    <span
      className="w-10 h-10 bg-cover rounded-full"
      style={{
        backgroundImage: session?.user?.image
          ? `url('${session.user.image}')`
          : 'lightgray',
      }}
      title={session?.user?.email ?? session?.user?.name ?? 'No name provided'}
    />
  </div>
);

export default User;
