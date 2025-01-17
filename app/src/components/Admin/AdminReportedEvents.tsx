import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Alert,
    useTheme,
    useMediaQuery,
    Card,
    CardContent,
    Stack
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import API_URLS from '../../constants/apiUrls';
import Pagination from '../Common/Pagination/Pagination';

interface ReportedEvent {
    _id: string;
    name: string;
    description: string;
    date: string;
    time: string;
    locationType: string;
    eventTypes: string[];
    organizer: string;
}

export default function ReportedEventsPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [reportedEvents, setReportedEvents] = useState<ReportedEvent[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const token = useSelector((state: RootState) => state.user.token);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReportedEvents = async () => {
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(API_URLS.ADMIN_REPORTED_EVENTS, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                        return;
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch reported events');
                }

                const eventsData = result.data || [];
                setReportedEvents(eventsData);
                setTotalPages(Math.ceil(eventsData.length / itemsPerPage));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchReportedEvents();
    }, [token, navigate, itemsPerPage]);

    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = reportedEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
        setTotalPages(Math.ceil(reportedEvents.length / items));
    };

    const MobileEventCard = ({ event, index }: { event: ReportedEvent; index: number }) => (
        <Card sx={{ mb: 2, backgroundColor: "#ffffff" }}>
            <CardContent>
                <Stack spacing={1}>
                    <Typography variant="subtitle2">Sr. No: {indexOfFirstEvent + index + 1}</Typography>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Event Name</Typography>
                        <Typography>{event.name}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Description</Typography>
                        <Typography>{event.description}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Date & Time</Typography>
                        <Typography>
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="textSecondary">Location Type</Typography>
                        <Typography>{event.locationType}</Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    if (loading) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
        </Box>
    );
    
    if (error) return (
        <Box mb={2}>
            <Alert severity="error">{error}</Alert>
        </Box>
    );

    if (reportedEvents.length === 0) return (
        <Alert severity="info">No reported events found</Alert>
    );

    return (
        <Box sx={{ width: "100%", mt: { xs: -5, sm: -10 }, p: { xs: 1, sm: 2 } }}>
            {isMobile ? (
                <Box>
                    {currentEvents.map((event, index) => (
                        <MobileEventCard key={event._id} event={event} index={index} />
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper} sx={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    overflowX: "auto"
                }}>
                    <Table stickyHeader aria-label="reported events table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Sr. No.</TableCell>
                                <TableCell>Event Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Location Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currentEvents.map((event, index) => (
                                <TableRow key={event._id} hover>
                                    <TableCell>{indexOfFirstEvent + index + 1}</TableCell>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{event.description}</TableCell>
                                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.time}</TableCell>
                                    <TableCell>{event.locationType}</TableCell>
                                </TableRow>
                            ))}
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
        </Box>
    );
}