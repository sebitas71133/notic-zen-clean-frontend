import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Grid2,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  NoteAdd as NoteAddIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
} from "@mui/icons-material";
import { setActiveNote } from "../../../store/slices/noteSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const nyan_cat =
  "Nyan Cat es el nombre de un vídeo de YouTube subido en abril de 2011, que se convirtió en un fenómeno de Internet, en referencia a un gif animado de 8 bits de un gato volando con el cuerpo";

export const NoteCard = ({ notes }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      {notes.length > 0 ? (
        notes.map((note) => (
          <Grid2 size={{ xs: 6, sm: 3, md: 3, xl: 2 }} key={note.id}>
            <Card
              sx={{
                borderRadius: 3,
                height: 320,
                display: "flex",
                flexDirection: "column",
                boxShadow: 3,
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                borderLeft: `6px solid ${note.category?.color || "#90caf9"}`,
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 8px 16px rgba(0,0,0,0.15)`,
                },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                onClick={() => {
                  dispatch(setActiveNote(note));
                  navigate(`/app/note/${note.id}`);
                }}
              >
                {/* Imagen */}
                <Box sx={{ position: "relative", height: 180, width: "100%" }}>
                  <CardMedia
                    component="img"
                    image={
                      note.images?.length > 0
                        ? note.images[0].url
                        : "/images/nyan-cat.gif"
                    }
                    alt={note.title || "Imagen de la nota"}
                    sx={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                    }}
                  />

                  {/* Overlay oscuro */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      p: 1,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                      color: "white",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      // borderBottomLeftRadius: 12,
                      // borderBottomRightRadius: 12,
                    }}
                  >
                    {/* Título */}
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        fontSize: "1rem",
                      }}
                    >
                      {note.title || "Sin título"}
                    </Typography>

                    {/* Acciones: pin/archivado */}
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      {note.isPinned && (
                        <Tooltip title="Fijada">
                          <PushPinIcon sx={{ fontSize: 18, color: "gold" }} />
                        </Tooltip>
                      )}
                      {note.isArchived && (
                        <Tooltip title="Archivada">
                          <ArchiveIcon
                            sx={{ fontSize: 18, color: "lightgray" }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Contenido */}
                <CardContent
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 1.5,
                  }}
                >
                  {/* Texto */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: 40, // 👈 fijo
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {note.content || nyan_cat}
                  </Typography>

                  {/* Tags + categoría */}
                  <Box
                    sx={{
                      mt: 2,
                      height: 20,
                      flexShrink: 0,
                    }}
                  >
                    {note.category && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: note.category.color,
                            mr: 1,
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: "bold",
                            color: note.category.color,
                          }}
                        >
                          {note.category.name}
                        </Typography>
                      </Box>
                    )}

                    {note.tags?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                          maxHeight: 20,
                          overflow: "hidden",

                          position: "absolute",
                          top: 0,
                          // top: 110,
                          left: 0,
                        }}
                      >
                        {note.tags.slice(0, 3).map((tag) => (
                          <Typography
                            key={tag.id}
                            variant="caption"
                            sx={{
                              backgroundColor: "#e0e0e0",
                              px: 0.8,
                              py: 0.3,
                              borderRadius: 1,
                              color: "black",
                              fontSize: "0.72rem",
                            }}
                          >
                            #{tag.name}
                          </Typography>
                        ))}
                      </Box>
                    )}
                  </Box>

                  {/* Footer */}
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mt: 2, textAlign: "left", height: 20 }}
                  >
                    {new Date(note.updatedAt).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))
      ) : (
        <Grid xs={12}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="body1">
              No se encontraron notas con los filtros actuales.
            </Typography>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ mt: 2, mr: 2 }}
            >
              Limpiar Filtros
            </Button>
            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              onClick={handleNewNote}
              sx={{ mt: 2 }}
            >
              Crear Nota
            </Button>
          </Paper>
        </Grid>
      )}
    </>
  );
};
