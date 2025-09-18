import { Box, Chip, Stack, Typography } from "@mui/material";
import { Star, Group } from "@mui/icons-material";
import InfoIcon from "@mui/icons-material/Info";

export const IsOwner = ({ isNewNote, activeNote, userId }) => {
  return (
    <Stack pl={4} direction="row" spacing={2} alignItems="center">
      {!isNewNote &&
        (activeNote?.userId === userId ? (
          <Chip
            icon={<Star fontSize="small" />}
            label="Owner"
            color="success"
            size="small"
          />
        ) : (
          <Chip
            icon={<Group fontSize="small" />}
            label="Shared"
            color="info"
            size="small"
          />
        ))}

      {!isNewNote && activeNote?.userId !== userId && (
        <Box
          sx={{
            p: 1.5,
            mb: 2,
            bgcolor: "warning.light",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InfoIcon fontSize="small" />
          <Typography variant="body2">
            You are editing a shared note. Some options may be restricted.
          </Typography>
        </Box>
      )}
    </Stack>
  );
};
