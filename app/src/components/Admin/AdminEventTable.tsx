import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TextField, 
  Typography, 
  IconButton, 
  Box, 
  CircularProgress, 
  Alert,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import { Edit, Save, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import Pagination from "../Common/Pagination/Pagination";
import API_URLS from "../../constants/apiUrls";

interface Event {
  _id: number;
  name: string;
  description: string;
  date: string;
  locationType: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEventTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [events, setEvents] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URLS.GET_ALL_EVENTS, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          navigate("/login");
          return;
        }

        const result = await response.json();
        const eventData = result.data?.events || [];
        setEvents(Array.isArray(eventData) ? eventData : []);
        setTotalPages(Math.ceil(eventData.length / itemsPerPage));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, navigate, itemsPerPage]);

  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setTotalPages(Math.ceil(events.length / items));
  };

  const handleUpdateClick = (event: Event) => {
    setEditingId(event._id);
    setEditedEvent({ ...event });
  };

  const handleSaveClick = async () => {
    if (!editingId || !editedEvent) return;

    try {
      const response = await fetch(API_URLS.GET_ALL_EVENTS, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          eventId: editingId.toString(),
        },
        body: JSON.stringify({
          name: editedEvent.name,
          description: editedEvent.description,
          date: editedEvent.date,
          locationType: editedEvent.locationType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update event");
      }

      const result = await response.json();
      const updatedEvent = result.data || result;
      setEvents(prevEvents => 
        prevEvents.map(event => event._id === editingId ? updatedEvent : event)
      );
      setEditingId(null);
      setEditedEvent({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    }
  };

  const handleDeleteClick = (eventId: number) => {
    setEventToDelete(eventId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    try {
      const response = await fetch(API_URLS.GET_ALL_EVENTS, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          eventId: eventToDelete.toString(),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents(events.filter(event => event._id !== eventToDelete));
      setDeleteModalOpen(false);
      setEventToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const handleInputChange = (field: keyof Event, value: string) => {
    setEditedEvent(prev => ({ ...prev, [field]: value }));
  };

  const MobileEventCard = ({ event, index }: { event: Event; index: number }) => (
    <Card sx={{ mb: 2, backgroundColor: "#ffffff" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Sr. No: {indexOfFirstEvent + index + 1}</Typography>
          
          <Box>
            <Typography variant="caption" color="textSecondary">Name</Typography>
            {editingId === event._id ? (
              <TextField
                value={editedEvent.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{event.name}</Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">Description</Typography>
            {editingId === event._id ? (
              <TextField
                value={editedEvent.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{event.description}</Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">Date</Typography>
            {editingId === event._id ? (
              <TextField
                value={editedEvent.date || ""}
                onChange={(e) => handleInputChange("date", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{event.date}</Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">Location Type</Typography>
            {editingId === event._id ? (
              <TextField
                value={editedEvent.locationType || ""}
                onChange={(e) => handleInputChange("locationType", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{event.locationType}</Typography>
            )}
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">Created At</Typography>
            <Typography>{new Date(event.createdAt).toLocaleString()}</Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="textSecondary">Updated At</Typography>
            <Typography>{new Date(event.updatedAt).toLocaleString()}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            {editingId === event._id ? (
              <IconButton color="primary" onClick={handleSaveClick}>
                <Save />
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={() => handleUpdateClick(event)}>
                <Edit />
              </IconButton>
            )}
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(event._id)}
              disabled={editingId === event._id}
            >
              <Delete />
            </IconButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ width: "100%", mt: { xs: -5, sm: -10 }, p: { xs: 1, sm: 2 } }}>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <>
          {isMobile ? (
            <Box>
              {currentEvents.length === 0 ? (
                <Typography variant="subtitle1" align="center">No events found</Typography>
              ) : (
                currentEvents.map((event, index) => (
                  <MobileEventCard key={event._id} event={event} index={index} />
                ))
              )}
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{
                width: "100%",
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "& .MuiTableCell-head": {
                  backgroundColor: "#f5f5f5",
                  fontWeight: 600,
                  borderBottom: "2px solid #e0e0e0"
                },
                "& .MuiTableCell-body": {
                  fontSize: "0.875rem",
                  padding: "16px"
                }
              }}
            >
              <Table aria-label="event table">
                <TableHead>
                  <TableRow>
                    <TableCell width="8%">Sr. No.</TableCell>
                    <TableCell width="15%">Name</TableCell>
                    <TableCell width="25%">Description</TableCell>
                    <TableCell width="15%">Date</TableCell>
                    <TableCell width="10%">Location Type</TableCell>
                    <TableCell width="12%">Created At</TableCell>
                    <TableCell width="12%">Updated At</TableCell>
                    <TableCell width="6%" align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentEvents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="subtitle1">No events found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentEvents.map((event, index) => (
                      <TableRow key={event._id} hover>
                        <TableCell>{indexOfFirstEvent + index + 1}</TableCell>
                        <TableCell>
                          {editingId === event._id ? (
                            <TextField
                              value={editedEvent.name || ""}
                              onChange={(e) => handleInputChange("name", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            event.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === event._id ? (
                            <TextField
                              value={editedEvent.description || ""}
                              onChange={(e) => handleInputChange("description", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            event.description
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === event._id ? (
                            <TextField
                              value={editedEvent.date || ""}
                              onChange={(e) => handleInputChange("date", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            event.date
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === event._id ? (
                            <TextField
                              value={editedEvent.locationType || ""}
                              onChange={(e) => handleInputChange("locationType", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            event.locationType
                          )}
                        </TableCell>
                        <TableCell>{new Date(event.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(event.updatedAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            {editingId === event._id ? (
                              <IconButton color="primary" onClick={handleSaveClick}>
                                <Save />
                              </IconButton>
                            ) : (
                              <IconButton color="primary" onClick={() => handleUpdateClick(event)}>
                                <Edit />
                              </IconButton>
                            )}
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(event._id)}
                              disabled={editingId === event._id}
                            >
                              <Delete />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box sx={{ mt: 2 }}>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Box>
        </>
      )}

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setEventToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}