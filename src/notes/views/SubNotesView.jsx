import React, { useEffect, useState } from "react";
import { useGetSubNotesQuery } from "../../../services/subNoteApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveSubNote,
  setFilteredSubNotes,
  setSearchSubTerm,
  setSubNotes,
} from "../../store/slices/noteSlice";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  FormControl,
  Grid,
  Grid2,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NotesIcon from "@mui/icons-material/Notes";
import {
  NoteAdd as NoteAddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  PushPin as PushPinIcon,
  Archive as ArchiveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useGetTagsQuery } from "../../../services/tagApi";
import { Navigate, useNavigate } from "react-router-dom";

export const SubNotesView = ({ noteId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const [tagFilter, setTagFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortTitle, setSortTitle] = useState("asc");
  const [sortDate, setSortDate] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { filteredSubNotes, searchSubTerm } = useSelector(
    (state) => state.note
  );

  const { data: subNotesData = [], isLoading: isSubNotesLoading } =
    useGetSubNotesQuery({
      page: page,
      limit: limit,
      noteId: noteId,

      ...(tagFilter && { tagId: tagFilter }),
      ...(statusFilter && { statusFilter: statusFilter }),
      ...(sortTitle && { sortTitle: sortTitle }),
      ...(sortDate && { sortDate: sortDate }),
    });

  const { data: subNotesData2 = [], isLoading: isSubNotesLoading2 } =
    useGetSubNotesQuery({
      page: 1,
      limit: 500,
      noteId: noteId,
    });

  const subNotesTotal = subNotesData2?.data?.length;

  const totalPages = Math.ceil(subNotesTotal / limit);

  const { data: tagsData = [] } = useGetTagsQuery({ page: 1, limit: 50 });

  const handleNewSubNote = () => {
    navigate(`/app/note/${noteId}/subnote/new`);
  };

  useEffect(() => {
    if (searchSubTerm === "") {
      dispatch(setFilteredSubNotes([]));
    }
  }, [searchSubTerm, dispatch]);

  useEffect(() => {
    dispatch(setSubNotes(subNotesData.data));
  }, [dispatch, subNotesData.data]);

  const handleClearFilters = () => {
    setSearchSubTerm("");

    setTagFilter("");
    setStatusFilter("all");
  };

  if (isSubNotesLoading) {
    return <CircularProgress size={20} />;
  }
  const subNotes = subNotesData.data;

  const displayedSubNotes =
    filteredSubNotes.length > 0 ? filteredSubNotes : subNotes || [];

  return (
    <Box>
      {/* TITULO Y BOTON DE AGRTE */}

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
          Sub Notes
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={handleNewSubNote}
            sx={{
              fontSize: {
                xs: "12px",
                sm: "14px",
                md: "16px",
              },
            }}
          >
            ADD SUBNOTE
          </Button>
        </Box>
      </Box>

      {/* SEARCH AND FILTER */}

      <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Searching for subnotes on current page..."
          value={searchSubTerm}
          onChange={(e) => dispatch(setSearchSubTerm(e.target.value))}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchSubTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => {
                    dispatch(setSearchSubTerm(""));
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

      {/* SUBNOTES */}
      <Grid2 container spacing={1}>
        {" "}
        {/* menos espacio entre tarjetas */}
        {subNotes?.length > 0 ? (
          displayedSubNotes.map((subNote) => (
            <Grid2 size={{ xs: 4, sm: 3, md: 3, xl: 2 }} key={subNote.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  height: 220, // altura consistente
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 2,
                  transition: "transform 0.2s ease, box-shadow 0.3s ease",
                  backgroundColor: (theme) => theme.palette.background.paper,
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: 5,
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
                    dispatch(setActiveSubNote(subNote));
                    navigate(`/app/note/${noteId}/subnote/${subNote.id}`);
                  }}
                >
                  {/* Imagen */}
                  <CardMedia
                    component="img"
                    height="180"
                    image={
                      subNote.images?.length > 0
                        ? subNote.images[0].url
                        : "/images/nyan-cat.gif"
                    }
                    alt={subNote.title || "Imagen de la nota"}
                    sx={{
                      objectFit: "cover",
                      width: "100%",
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8,
                    }}
                  />

                  {/* Contenido */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      width: "100%",
                      p: 1.2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Título */}
                    <Typography
                      variant="subtitle2"
                      fontWeight="bold"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mb: 1,
                      }}
                    >
                      {subNote.title || "Sin título"}
                    </Typography>

                    {/* Tags */}
                    {/* {subNote.tags?.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        {subNote.tags.slice(0, 2).map((tag) => (
                          <Typography
                            key={tag.id}
                            variant="caption"
                            sx={{
                              backgroundColor: "#e0e0e0",
                              px: 0.6,
                              py: 0.2,
                              borderRadius: 1,
                              fontSize: "0.7rem",
                            }}
                          >
                            #{tag.name}
                          </Typography>
                        ))}
                      </Box>
                    )} */}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
          ))
        ) : (
          <Grid2 xs={12}>
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
                onClick={handleNewSubNote}
                sx={{ mt: 2 }}
              >
                Add subNote
              </Button>
            </Paper>
          </Grid2>
        )}
      </Grid2>

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
