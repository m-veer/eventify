import React from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import "./i18n/i18n";

// Components
import Layout from "./components/User/Layout/Layout";

// Pages
import Home from "./pages/Home/Home";
import MyTickets from "./pages/MyTickets/MyTickets";
import EventPage from "./pages/Events/EventPage";
import EventChatbot from "./components/Chatbot/EventChatbot";
import AccountSettings from "./pages/AccountSettings/AccountSettings";
import AdminHomePage from "./pages/AdminHomePage/AdminHomePage";
import AdminUserPage from "./pages/AdminUserPage/AdminUserPage";
import AdminEventPage from "./pages/AdminEventPage/AdminEventPage";
import AdminReportedEvents from "./pages/AdminReportedEvents/AdminReportedEvents";
import SearchResults from "./pages/SearchResults/SearchResults";
import DevelopedBy from "./pages/StaticPages/DevelopedBy";
import AboutUs from "./pages/StaticPages/AboutUs";
import PrivacyPolicy from "./pages/StaticPages/PrivacyPolicy";
import TermsAndConditions from "./pages/StaticPages/TermsAndConditions";
import ContactUsForm from "./pages/StaticPages/ContactUsForm";
// import EventForm from "./pages/Events/EventForm/EventForm";

// Auth
import AuthWrapper from "./components/AuthWrapper/AuthWrapper";
import LoadingWrapper from "./components/LoadingWrapper/LoadingWrapper";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import NotFound from "./pages/PageNotFound/NotFound";
// import AttendeeEventList from "./pages/EventList/AttendeeEventList";
import OrganizerEventList from "./pages/EventList/OrganizerEventList";
import CheckoutPage from "./components/Payments/CheckoutPage";
import PaymentSuccess from "./components/Payments/PaymentSuccess";
import AdminLayout from "./components/Admin/AdminLayout/AdminLayout";
import BrowseEvents from "../src/pages/EventList/BrowseEvents";

const theme: Theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    error: {
      main: "#ff0000", // For consistent red color across components
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "none !important",
          width: "100%",
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});

const App: React.FC = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <LoadingWrapper>
          <AuthWrapper>
            {user.isAdmin && user.role === "admin" ? (
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<AdminHomePage />} />
                  <Route path="/admin-users" element={<AdminUserPage />} />
                  <Route path="/admin-events" element={<AdminEventPage />} />
                  <Route
                    path="/admin-reported-events"
                    element={<AdminReportedEvents />}
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </AdminLayout>
            ) : (
              <>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                      path="/myTickets"
                      element={
                        <ProtectedRoute>
                          <MyTickets />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/search" element={<SearchResults />} />
                    <Route
                      path="/browseEvents"
                      element={<BrowseEvents />}
                    />
                    <Route path="/myEvents" element={<OrganizerEventList />} />
                    {/* <Route
                      path="/create-event"
                      element={
                        <ProtectedRoute>
                          <EventForm />
                        </ProtectedRoute>
                      }
                    /> */}
                    <Route path="/event" element={<EventPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route
                      path="/accountSettings"
                      element={
                        <ProtectedRoute>
                          <AccountSettings />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/developed-by" element={<DevelopedBy />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsAndConditions />} />
                    <Route path="/contact-us" element={<ContactUsForm />} />
                  </Routes>
                </Layout>
                <EventChatbot events={[]} />
              </>
            )}
          </AuthWrapper>
        </LoadingWrapper>
      </Router>
    </ThemeProvider>
  );
};

export default App;
