import React from "react";

function AccountDetailsForm({ user }) {
  return (
    <div>
      <h5>Account Details</h5>
      <p>Username: {user.username}</p>
      <p>Usertype: {user.usertype}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default AccountDetailsForm;
