import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Paper,
  CardMedia,
} from "@mui/material";
import {
  NoteAdd as NoteAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { setActiveNote } from "../../store/slices/noteSlice";
import { useDispatch } from "react-redux";

export const NotesPage = () => {
  const { notes, user, categories } = useOutletContext();

  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleNewNote = () => {
    navigate("/app/note/new");
  };

  // useEffect(() => {
  //   if (currentUser) {
  //     const userNotes = notes.filter((note) => note.user_id === currentUser.id);
  //     setFilteredNotes(userNotes);
  //   }
  // }, [currentUser, notes]);

  // useEffect(() => {
  //   applyFilters();
  // }, [searchTerm, categoryFilter, statusFilter, notes]);

  // const applyFilters = () => {
  //   let filtered = notes.filter((note) => note.user_id === currentUser?.id);

  //   if (searchTerm) {
  //     filtered = filtered.filter(
  //       (note) =>
  //         (note.title &&
  //           note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
  //         (note.content &&
  //           note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  //     );
  //   }

  //   if (categoryFilter) {
  //     filtered = filtered.filter((note) => note.category_id === categoryFilter);
  //   }

  //   if (statusFilter === "pinned") {
  //     filtered = filtered.filter((note) => note.is_pinned);
  //   } else if (statusFilter === "archived") {
  //     filtered = filtered.filter((note) => note.is_archived);
  //   } else if (statusFilter === "active") {
  //     filtered = filtered.filter((note) => !note.is_archived);
  //   }

  //   setFilteredNotes(filtered);
  // };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("all");
    setFilteredNotes(notes);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Sin categoría";
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.color : "#e0e0e0";
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Mis Notas
        </Typography>
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          onClick={handleNewNote}
        >
          Nueva Nota
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Buscar notas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm("")}>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          size="small"
        />

        <Tooltip title="Filtros">
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <Box sx={{ p: 2, minWidth: 250 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Filtros
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Categoría</InputLabel>
              <Select
                value={categoryFilter}
                label="Categoría"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {[]
                  .filter((cat) => cat.user_id === currentUser?.id)
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="active">Activas</MenuItem>
                <MenuItem value="pinned">Fijadas</MenuItem>
                <MenuItem value="archived">Archivadas</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              fullWidth
            >
              Limpiar Filtros
            </Button>
          </Box>
        </Menu>
      </Box>

      <Grid container spacing={3}>
        {notes.length > 0 ? (
          notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ height: "100%" }}>
                <CardActionArea
                  onClick={() => {
                    dispatch(setActiveNote(note));

                    navigate(`/app/note/${note.id}`); // redirige al editor de nota
                  }}
                >
                  {note.images?.length > 0 && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={note.images[0].url}
                      alt={note.title || "Imagen de la nota"}
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" component="div" noWrap>
                        {note.title || "Sin título"}
                      </Typography>
                      <Box>
                        {note.is_pinned && (
                          <PushPinIcon color="secondary" fontSize="small" />
                        )}
                        {note.is_archived && (
                          <ArchiveIcon color="action" fontSize="small" />
                        )}
                      </Box>
                    </Box>

                    {/* <Chip
                      label={getCategoryName(note.categoryId)}
                      size="small"
                      sx={{
                        bgcolor: getCategoryColor(note.categoryId),
                        color: "white",
                        mb: 1,
                      }}
                    /> */}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {note.content || "Sin contenido"}
                    </Typography>

                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      Actualizado:{" "}
                      {new Date(note.updatedAt).toLocaleString("es-PE", {
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
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
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
      </Grid>
    </Box>
  );
};
