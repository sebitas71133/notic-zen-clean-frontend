import { UsersTable } from "../components/UsersTable";
import {
  Box,
  Divider,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import { useGetUsersQuery } from "../../../services/authApi";
import {
  useGetConfigQuery,
  useToggleModerationMutation,
  useToggleSendEmailMutation,
} from "../../../services/adminApi";
import { useEffect, useState } from "react";

export const UsersView = () => {
  const { data: usersData, isLoading, isError } = useGetUsersQuery();

  const { data: configData, refetch: refetchConfig } = useGetConfigQuery();
  const [toggleModeration] = useToggleModerationMutation();
  const [toggleSendEmail] = useToggleSendEmailMutation();

  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [sendEmailEnabled, setSendEmailEnabled] = useState(false);

  // Obtener config inicial al montar
  useEffect(() => {
    if (configData) {
      setModerationEnabled(configData.data?.moderateImage === "true");
      setSendEmailEnabled(configData.data?.sendEmail === "true");
    }
  }, [configData]);

  const handleToggleModeration = async () => {
    await toggleModeration();
    setModerationEnabled((prev) => !prev);
  };

  const handleToggleSendEmail = async () => {
    await toggleSendEmail();
    setSendEmailEnabled((prev) => !prev);
  };

  return (
    <>
      <Typography variant="h3">Asignar Roles</Typography>
      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <UsersTable users={usersData.data} />
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h4" gutterBottom>
        Configuración del sistema
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControlLabel
          control={
            <Switch
              checked={moderationEnabled}
              onChange={handleToggleModeration}
            />
          }
          label="Moderación de imágenes"
        />
        <FormControlLabel
          control={
            <Switch
              checked={sendEmailEnabled}
              onChange={handleToggleSendEmail}
            />
          }
          label="Enviar email al registrar usuario"
        />
      </Box>
    </>
  );
};
