import React from "react";
import { useSelector } from "react-redux";

import { UsersTable } from "../components/UsersTable";
import { Typography } from "@mui/material";

export const UsersView = () => {
  const { users, isLoading = false } = useSelector((state) => state.users);

  return (
    <>
      {/* <NavBar></NavBar> */}

      <Typography variant="h3">Asignar Roles</Typography>
      {isLoading ? <p>Cargando usuarios...</p> : <UsersTable users={users} />}
    </>
  );
};
