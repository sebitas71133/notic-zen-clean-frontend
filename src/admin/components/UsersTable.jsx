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
import { useUpdateRoleMutation } from "../../../services/authApi";
import Swal from "sweetalert2";

const roles = [
  { id: 1, name: "admin" },
  { id: 2, name: "user" },
];

export const UsersTable = ({ users }) => {
  const dispatch = useDispatch();
  const { control, handleSubmit } = useForm();

  const [updateRole, { isLoading: isLoadingUpdateRole }] =
    useUpdateRoleMutation();

  const handleRoleChange = async (userId, roleId) => {
    try {
      const response = await updateRole({ userId, roleId });

      Swal.fire({
        title: `Rol actualizado !`,
        icon: "success",
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
                      rgba(0,0,123,0.4)
                      url("/images/nyan-cat.gif")
                      right top
                      no-repeat
                    `,
      });
      console.log("✅ Rol actualizado:", response);
    } catch (err) {
      console.error("❌ Error al actualizar rol:", err);
      wal.fire("Oops", `${err.data.error}`);
    }
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
            <TableRow key={user.id}>
              <TableCell>
                <Typography variant="body1">{user.email}</Typography>
              </TableCell>
              <TableCell>
                <Controller
                  name={`role-${user.id}`}
                  control={control}
                  defaultValue={user.role.id}
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleRoleChange(user.id, e.target.value);
                      }}
                      size="small"
                      sx={{ minWidth: 120 }}
                    >
                      {roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name === "admin" ? "Admin" : "Usuario"}
                        </MenuItem>
                      ))}
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
