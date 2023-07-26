import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';

const SignInButton = ({ signIn }) => (
  <button
    className="text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 hover:bg-palette419_3 border border-palette419_5"
    onClick={(e) => {
      e.preventDefault();
      signIn();
    }}
    title="Sign in"
  >
    <FontAwesomeIcon icon={faSignInAlt} />
  </button>
);

export default SignInButton;
