import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  exportJSON,
  exportNotesAsZip,
  exportNotesToExcel,
  exportNotesToPDF,
} from "../../utils/exportNotes";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableChartIcon from "@mui/icons-material/TableChart"; // Para Excel
import FolderZipIcon from "@mui/icons-material/FolderZip";
import CodeIcon from "@mui/icons-material/Code"; // Para JSON

export const ExportMenuNotes = ({ notes }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExportJSON = () => {
    exportJSON(notes);
    handleClose();
  };

  const handleExportNotesToPDF = () => {
    exportNotesToPDF(notes);
    handleClose();
  };

  const handleExportNotesToExcel = () => {
    exportNotesToExcel(notes);
    handleClose();
  };
  const handleExportNotesAsZip = () => {
    exportNotesAsZip(notes);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls="export-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleExportJSON}>
          <CodeIcon fontSize="small" sx={{ mr: 1 }} />
          Exportar como JSON
        </MenuItem>
        <MenuItem onClick={handleExportNotesToPDF}>
          <PictureAsPdfIcon fontSize="small" sx={{ mr: 1 }} />
          Exportar como PDF
        </MenuItem>
        <MenuItem onClick={handleExportNotesToExcel}>
          <TableChartIcon sx={{ mr: 1 }} />
          Exportar en Excel
        </MenuItem>
        <MenuItem onClick={handleExportNotesAsZip}>
          <FolderZipIcon sx={{ mr: 1 }} />
          Exportar en zip
        </MenuItem>
      </Menu>
    </>
  );
};
