import {
  IconButton,
  Badge,
  Tooltip,
  Menu,
  MenuItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import {
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../../../services/nortificationApi";

// RTK Query

export const NotificationBell = () => {
  const theme = useTheme();
  const { data: notifications = [], isLoading } = useGetMyNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();

  const [markAllAsRead] = useMarkAllAsReadMutation();

  const unreadCount = notifications?.filter((n) => !n.isRead).length;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickBell = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleNotificationClick = async (id) => {
    await markAsRead({ id }); // marcar como leída
    handleCloseMenu();
  };

  const handleClearNotificationsClick = async () => {
    await markAllAsRead({}); // marcar como leída
    handleCloseMenu();
  };

  console.log(notifications);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleClickBell}>
          <Badge badgeContent={notifications.length} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        PaperProps={{ style: { maxHeight: 300, width: 300 } }}
      >
        {notifications.length === 0 && (
          <MenuItem disabled>No notifications</MenuItem>
        )}
        {notifications.map((notif) => (
          <MenuItem
            key={notif.id}
            onClick={() => handleNotificationClick(notif.id)}
            sx={{
              backgroundColor: notif.isRead
                ? "transparent"
                : theme.palette.action.hover,
            }}
          >
            <ListItemText
              primary={notif.message}
              secondary={
                <>
                  {notif.note?.title}
                  <br />
                  {new Date(notif.createdAt).toLocaleString()}
                </>
              }
            />
            {notif.note?.images?.[0] && (
              <img
                src={notif.note.images[0].url}
                alt="Note preview"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  marginLeft: 8,
                }}
              />
            )}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => handleClearNotificationsClick()}
          sx={{ justifyContent: "center", fontWeight: "bold", color: "red" }}
        >
          Borrar todas
        </MenuItem>
      </Menu>
    </>
  );
};
