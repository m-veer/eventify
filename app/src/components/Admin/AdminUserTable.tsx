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
  Stack,
} from "@mui/material";
import { Edit, Save, Delete } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "./DeleteConfirmationModal/DeleteConfirmationModal";
import API_URLS from "../../constants/apiUrls";
import Pagination from "../Common/Pagination/Pagination";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminUserTable() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URLS.ADMIN_GET_ALL_USERS, {
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
        const userData = result.data?.users || result.users || result;
        setUsers(Array.isArray(userData) ? userData : []);
        setTotalPages(Math.ceil(userData.length / itemsPerPage));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate, itemsPerPage]);

  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
    setTotalPages(Math.ceil(users.length / items));
  };

  const handleUpdateClick = (user: User) => {
    setEditingId(user._id);
    setEditedUser({ ...user });
  };

  const validateUserData = (data: Partial<User>) => {
    if (!data.firstName?.trim()) return "First name is required";
    if (!data.lastName?.trim()) return "Last name is required";
    if (!data.email?.trim()) return "Email is required";
    return null;
  };

  const handleSaveClick = async () => {
    if (!editingId || !editedUser) return;
    const validationError = validateUserData(editedUser);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch(API_URLS.ADMIN_GET_ALL_USERS, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          userid: editingId,
        },
        body: JSON.stringify({
          firstName: editedUser.firstName,
          lastName: editedUser.lastName,
          email: editedUser.email,
          location: editedUser.location
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const result = await response.json();
      const updatedUser = result.data || result;
      setUsers(prevUsers => 
        prevUsers.map(user => user._id === editingId ? updatedUser : user)
      );
      setEditingId(null);
      setEditedUser({});
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(API_URLS.ADMIN_GET_ALL_USERS, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          userid: userToDelete,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter(user => user._id !== userToDelete));
      setDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleInputChange = (field: keyof User, value: string) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const MobileUserCard = ({ user, index }: { user: User; index: number }) => (
    <Card sx={{ mb: 2, backgroundColor: "#ffffff" }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Sr. No: {indexOfFirstUser + index + 1}</Typography>
          <Box>
            <Typography variant="caption" color="textSecondary">Email</Typography>
            {editingId === user._id ? (
              <TextField
                value={editedUser.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{user.email}</Typography>
            )}
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Name</Typography>
            {editingId === user._id ? (
              <Stack direction="row" spacing={1}>
                <TextField
                  value={editedUser.firstName || ""}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  variant="standard"
                  fullWidth
                  label="First Name"
                />
                <TextField
                  value={editedUser.lastName || ""}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  variant="standard"
                  fullWidth
                  label="Last Name"
                />
              </Stack>
            ) : (
              <Typography>{`${user.firstName} ${user.lastName}`}</Typography>
            )}
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Location</Typography>
            {editingId === user._id ? (
              <TextField
                value={editedUser.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                variant="standard"
                fullWidth
              />
            ) : (
              <Typography>{user.location}</Typography>
            )}
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Created At</Typography>
            <Typography>{new Date(user.createdAt).toLocaleString()}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="textSecondary">Updated At</Typography>
            <Typography>{new Date(user.updatedAt).toLocaleString()}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            {editingId === user._id ? (
              <IconButton color="primary" onClick={handleSaveClick}>
                <Save />
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={() => handleUpdateClick(user)}>
                <Edit />
              </IconButton>
            )}
            <IconButton
              color="error"
              onClick={() => handleDeleteClick(user._id)}
              disabled={editingId === user._id}
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
              {currentUsers.length === 0 ? (
                <Typography variant="subtitle1" align="center">No users found</Typography>
              ) : (
                currentUsers.map((user, index) => (
                  <MobileUserCard key={user._id} user={user} index={index} />
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
                overflowX: "auto"
              }}
            >
              <Table stickyHeader aria-label="user table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr. No.</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Updated At</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        <Typography variant="subtitle1">No users found</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((user, index) => (
                      <TableRow key={user._id} hover>
                        <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                        <TableCell>
                          {editingId === user._id ? (
                            <TextField
                              value={editedUser.email || ""}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            user.email
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === user._id ? (
                            <TextField
                              value={editedUser.firstName || ""}
                              onChange={(e) => handleInputChange("firstName", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            user.firstName
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === user._id ? (
                            <TextField
                              value={editedUser.lastName || ""}
                              onChange={(e) => handleInputChange("lastName", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            user.lastName
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === user._id ? (
                            <TextField
                              value={editedUser.location || ""}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                              variant="standard"
                              fullWidth
                            />
                          ) : (
                            user.location
                          )}
                        </TableCell>
                        <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                        <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                            {editingId === user._id ? (
                              <IconButton color="primary" onClick={handleSaveClick}>
                                <Save />
                              </IconButton>
                            ) : (
                              <IconButton color="primary" onClick={() => handleUpdateClick(user)}>
                                <Edit />
                              </IconButton>
                            )}
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteClick(user._id)}
                              disabled={editingId === user._id}
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
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}