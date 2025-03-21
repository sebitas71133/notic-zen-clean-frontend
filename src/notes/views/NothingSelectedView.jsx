import { Grid2, Typography } from "@mui/material";
import { StarOutline } from "@mui/icons-material";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";

export const NothingSelectedView = () => {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "calc(100vh - 110px)",
        backgroundColor: "primary.main",
        borderRadius: 3,
      }}
    >
      <Grid2 item xs={12}>
        <NoteAddOutlinedIcon sx={{ fontSize: 100, color: "white" }} />
      </Grid2>
      <Grid2 item xs={12}>
        <Typography color="white" variant="h5">
          Select or create a note
        </Typography>
      </Grid2>
    </Grid2>
  );
};
