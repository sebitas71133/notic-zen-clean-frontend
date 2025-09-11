// components/ShareNoteForm.js

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  useChangeRoleNoteMutation,
  useRevokeShareNoteMutation,
  useShareNoteMutation,
} from "../../../../services/noteApi";

const ShareNoteForm = ({ noteId, sharedUsers = [], onUpdated }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");

  const [shareNote, { isLoading: isSharing }] = useShareNoteMutation();
  const [changeRoleNote] = useChangeRoleNoteMutation();
  const [revokeShareNote] = useRevokeShareNoteMutation();

  const handleShare = async () => {
    console.log({ noteId, email, role });
    try {
      await shareNote({ noteId, email, role }).unwrap();
      setEmail("");
      //   if (onUpdated) onUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    console.log({ userId, newRole });
    try {
      await changeRoleNote({ id: noteId, userId, role: newRole }).unwrap();
      //   if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Error changing role:", err);
    }
  };

  const handleRevoke = async (userId) => {
    try {
      await revokeShareNote({ id: noteId, userId }).unwrap();
      //   if (onUpdated) onUpdated();
    } catch (err) {
      console.error("Error revoking share:", err);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Compartir nota</Typography>

      {/* Invitar usuario */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          label="Email del usuario"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <Select value={role} onChange={(e) => setRole(e.target.value)}>
          <MenuItem value="VIEWER">Viewer</MenuItem>
          <MenuItem value="EDITOR">Editor</MenuItem>
        </Select>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={isSharing || !email}
        >
          Compartir
        </Button>
      </Box>

      {/* Lista de usuarios con acceso */}
      <List>
        {sharedUsers?.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nadie más tiene acceso.
          </Typography>
        )}
        {sharedUsers?.map((user) => (
          <ListItem key={user.id} divider>
            <ListItemText
              primary={user.email}
              secondary={`Rol: ${user.role}`}
            />
            <ListItemSecondaryAction>
              <Select
                size="small"
                value={user.role}
                onChange={(e) => handleChangeRole(user.id, e.target.value)}
                sx={{ mr: 2 }}
              >
                <MenuItem value="VIEWER">Viewer</MenuItem>
                <MenuItem value="EDITOR">Editor</MenuItem>
              </Select>
              <IconButton
                edge="end"
                color="error"
                onClick={() => handleRevoke(user.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ShareNoteForm;
