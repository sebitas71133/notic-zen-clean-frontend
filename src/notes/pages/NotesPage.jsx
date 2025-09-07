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
  Grid2,
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
  setSearchTerm,
} from "../../store/slices/noteSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetNotesQuery } from "../../../services/noteApi";
import { useGetTagsQuery } from "../../../services/tagApi";
import { FullScreenLoader } from "../components/FullScreenLoader";
import { NoteCard } from "../components/note/NoteCard";

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
    return <FullScreenLoader message="Cargando notas..." />;
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

      <Grid2 container spacing={3}>
        <NoteCard notes={displayedNotes}></NoteCard>
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
