import React from "react";
import { useSelector } from "react-redux";

import { UsersTable } from "../components/UsersTable";
import { Typography } from "@mui/material";
import { useGetUsersQuery } from "../../../services/authApi";

export const UsersView = () => {
  // const { users, isLoading = false } = useSelector((state) => state.users);

  const { data: usersData, isLoading, isError } = useGetUsersQuery();
  console.log({ usersData });
  return (
    <>
      {/* <NavBar></NavBar> */}

      <Typography variant="h3">Asignar Roles</Typography>
      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <UsersTable users={usersData.data} />
      )}
    </>
  );
};
