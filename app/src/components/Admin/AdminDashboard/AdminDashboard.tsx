import { useEffect, useState } from 'react';
import { Box, Card, Typography, Container, Grid, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../store/store';
import API_URLS from '../../../constants/apiUrls';

interface Event {
  _id: string;
  name: string;
  date: string;
  locationType: string;
  isCompleted: boolean;
  isReported: boolean;
}

const AdminDashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = useSelector((state: RootState) => state.user.token);
  const navigate = useNavigate();

  const COLORS = {
    regular: '#0088FE',
    reported: '#00C49F',
    completed: '#8884d8',
    pending: '#00C49F',
    virtual: '#0088FE',
    inPerson: '#00C49F'
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(API_URLS.GET_ALL_EVENTS, {
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
          throw new Error('Failed to fetch events');
        }

        const result = await response.json();
        setEvents(result.data?.events || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token, navigate]);

  const chartConfigs = {
    height: isMobile ? 250 : 300,
    width: isMobile ? 300 : isTablet ? 350 : 400
  };

  const getPieChartData = () => [
    { name: 'Regular Events', value: events.filter(e => !e.isReported).length },
    { name: 'Reported Events', value: events.filter(e => e.isReported).length }
  ];

  const getStatusBarData = () => [
    { name: 'Completed', value: events.filter(e => e.isCompleted).length },
    { name: 'Pending', value: events.filter(e => !e.isCompleted).length }
  ];

  const getMonthlyEventsData = () => {
    const monthlyData = events.reduce((acc: { [key: string]: number }, event) => {
      const month = new Date(event.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(a.month) - months.indexOf(b.month);
      });
  };

  const getEventTypeData = () => [
    { name: 'Virtual', value: events.filter(e => e.locationType === 'virtual').length },
    { name: 'In-Person', value: events.filter(e => e.locationType === 'in-person').length }
  ];

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 4 }, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%', minHeight: chartConfigs.height + 100 }}>
            <Typography variant="h6" gutterBottom align="center">
              Total vs Reported Events
            </Typography>
            <ResponsiveContainer width="100%" height={chartConfigs.height}>
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={isMobile ? 80 : 100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.regular : COLORS.reported} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%', minHeight: chartConfigs.height + 100 }}>
            <Typography variant="h6" gutterBottom align="center">
              Event Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={chartConfigs.height}>
              <BarChart data={getStatusBarData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={COLORS.completed}>
                  {getStatusBarData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.completed : COLORS.pending} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%', minHeight: chartConfigs.height + 100 }}>
            <Typography variant="h6" gutterBottom align="center">
              Monthly Event Growth
            </Typography>
            <ResponsiveContainer width="100%" height={chartConfigs.height}>
              <LineChart data={getMonthlyEventsData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Events" stroke={COLORS.regular} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2, height: '100%', minHeight: chartConfigs.height + 100 }}>
            <Typography variant="h6" gutterBottom align="center">
              Event Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={chartConfigs.height}>
              <BarChart data={getEventTypeData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill={COLORS.virtual}>
                  {getEventTypeData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.virtual : COLORS.inPerson} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;