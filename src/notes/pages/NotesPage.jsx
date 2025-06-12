import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
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
  Stack,
  Pagination,
} from "@mui/material";
import {
  NoteAdd as NoteAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import NotesIcon from "@mui/icons-material/Notes";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  setActiveNote,
  setFilteredNotes,
  setNotes,
  setSearchTerm,
} from "../../store/slices/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetNotesQuery } from "../../../services/noteApi";
import { useGetTagsQuery } from "../../../services/tagApi";

export const NotesPage = () => {
  const { categories, notesTotal } = useOutletContext();

  // const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortTitle, setSortTitle] = useState("asc");
  const [sortDate, setSortDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { filteredNotes, searchTerm } = useSelector((state) => state.note);

  const { data: notesData = [], isLoading: isNotesLoading } = useGetNotesQuery({
    page: page,
    limit: limit,
    ...(categoryFilter && { categoryId: categoryFilter }),
    ...(tagFilter && { tagId: tagFilter }),
    ...(statusFilter && { statusFilter: statusFilter }),
    ...(sortTitle && { sortTitle: sortTitle }),
    ...(sortDate && { sortDate: sortDate }),
  });

  console.log({ notesData });

  const totalPages = Math.ceil(notesTotal / limit);

  const { data: tagsData = [] } = useGetTagsQuery({ page: 1, limit: 50 });

  const handleNewNote = () => {
    navigate("/app/note/new");
  };

  useEffect(() => {
    if (searchTerm === "") {
      dispatch(setFilteredNotes([]));
    }
  }, [searchTerm, dispatch]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setTagFilter("");
    setStatusFilter("all");
  };

  if (isNotesLoading || !notesData.data) {
    return <div>Cargando notas...</div>;
  }

  const notes = notesData.data;
  const displayedNotes = filteredNotes.length > 0 ? filteredNotes : notes || [];

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
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontSize: {
              xs: "1.3rem",
              sm: "1.5rem",
              md: "1.7rem",
            },
          }}
        >
          <NotesIcon
            fontSize="large"
            color="primary"
            sx={{ marginRight: 2 }}
          ></NotesIcon>
          Notes
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={handleNewNote}
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "16px",
              },
            }}
          >
            ADD NOTE
          </Button>
        </Box>
      </Box>

      {/* SEARCH AND FILTER */}

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Searching for notes on current page..."
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(setSearchTerm(""));
                  }}
                >
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
              Filters
            </Typography>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Tag</InputLabel>
              <Select
                value={tagFilter}
                label="Tag"
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {tagsData?.data?.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {/* <MenuItem value="active">Activas</MenuItem> */}
                <MenuItem value="pinned">Pinned</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Sort by Title</InputLabel>
              <Select
                value={sortTitle}
                label="Sort by Title"
                onChange={(e) => setSortTitle(e.target.value)}
              >
                <MenuItem value="">No order</MenuItem>
                <MenuItem value="asc">A - Z</MenuItem>
                <MenuItem value="desc">Z - A</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Sort by Date</InputLabel>
              <Select
                value={sortDate}
                label="Sort by Date"
                onChange={(e) => setSortDate(e.target.value)}
              >
                <MenuItem value="">No order</MenuItem>
                <MenuItem value="desc">Newest</MenuItem>
                <MenuItem value="asc">Oldest</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth sx={{ mb: 2 }}>
              <InputLabel id="limit-label">Notas por página</InputLabel>
              <Select
                labelId="limit-label"
                value={limit}
                label="Notas por página"
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1); // Reiniciar a la primera página si cambia el tamaño
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              fullWidth
            >
              Clean Filters
            </Button>
          </Box>
        </Menu>
      </Box>

      <Grid container spacing={3}>
        {notes.length > 0 ? (
          displayedNotes.map((note) => (
            <Grid item xs={6} sm={3} md={3} key={note.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  height: "320px",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 3,
                  transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  borderLeft: `6px solid ${note.category?.color || "#90caf9"}`, // Color de borde por categoría
                  backgroundColor: (theme) => theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: `0 8px 16px rgba(0,0,0,0.15)`,
                  },
                }}
              >
                <CardActionArea
                  sx={{ height: "100%" }}
                  onClick={() => {
                    dispatch(setActiveNote(note));
                    navigate(`/app/note/${note.id}`);
                  }}
                >
                  {note.images?.length > 0 && (
                    <CardMedia
                      component="img"
                      height="120"
                      image={note.images[0].url}
                      alt={note.title || "Imagen de la nota"}
                      sx={{
                        objectFit: "cover",
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        width: "100%",
                        display: "block",
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        noWrap
                        sx={{
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "normal",
                          maxWidth: "100%",
                          wordBreak: "break-word",
                          mb: 1,
                        }}
                      >
                        {note.title || "Sin título"}
                      </Typography>

                      <Box sx={{ display: "flex", gap: 0.5, opacity: 0.6 }}>
                        {note.isPinned && (
                          <Tooltip title="Fijada">
                            <PushPinIcon
                              color="primary.main"
                              fontSize="small"
                            />
                          </Tooltip>
                        )}
                        {note.isArchived && (
                          <Tooltip title="Archivada">
                            <ArchiveIcon color="action" fontSize="small" />
                          </Tooltip>
                        )}
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        maxWidth: "100%",
                        wordBreak: "break-word",
                        mb: 1,
                      }}
                    >
                      {note.content || "Sin contenido"}
                    </Typography>

                    {note.category && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
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
                          mb: 1,
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

                    <Typography variant="caption" color="text.secondary">
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

      <Stack spacing={2} mt={5} alignItems="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Stack>
    </Box>
  );
};
