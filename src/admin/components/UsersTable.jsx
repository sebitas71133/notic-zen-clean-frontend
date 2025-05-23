import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { updateUserRole } from "../../store/slices/authSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

export const UsersTable = ({ users }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const handleRoleChange = (uid, newRole) => {
    dispatch(updateUserRole({ uid, newRole }));
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="h6">Email</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="h6">Rol</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell>
                <Typography variant="body1">{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Controller
                  name={`role-${user.uid}`}
                  control={control}
                  defaultValue={user.role}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleRoleChange(user.uid, e.target.value);
                      }}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="usuario">Usuario</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
