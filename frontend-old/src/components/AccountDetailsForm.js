import React from "react";

function AccountDetailsForm({ user }) {
  return (
    <div>
      <h5>Account Details</h5>
      <p>Username: {user.username}</p>
      <p>Userdomain: {user.userdomain}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default AccountDetailsForm;
