
import { Routes, Route } from "react-router-dom";

// Route protection
import ProtectedRoutes from "./ProtectedRoutes.jsx";
import RoleRoutes from "./RoleRoutes.jsx";

// Public pages
import Home from "../pages/home/Home.jsx";
import About from "../pages/about/About.jsx";
import Events from "../pages/events/Events.jsx";
import News from "../pages/news/News.jsx";
import NewsDetails from "../pages/news/NewsDetails.jsx";
import EventsDetails from "../pages/events/EventsDetails.jsx";
import Contact from "../pages/contacts/Contact.jsx";
import Resources from "../pages/resources/Resources.jsx";
import ResourceReader from "../pages/resources/ResourceReader.jsx";
import Donate from "../pages/donate/Donate.jsx";
import HistoryAndValues from "../pages/about/HistoryAndValues.jsx";
import OurTeam from "../pages/about/OurTeam.jsx";
import OurLocations from "../pages/about/OurLocations.jsx";

// Authentication pages
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// Admin layout
import AdminLayout from "../components/admin/AdminLayout.jsx";

// Administrator pages
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AddEvent from "../pages/admin/AddEvent.jsx";
import EditEvent from "../pages/admin/EditEvent.jsx";
import ManageEvents from "../pages/admin/ManageEvents.jsx";
import Messages from "../pages/admin/messages/Messages.jsx";
import AddNews from "../pages/admin/AddNews.jsx";
import EditNews from "../pages/admin/EditNews.jsx";
import ManageNews from "../pages/admin/ManageNews.jsx";
import ManageMembers from "../pages/admin/ManageMembers.jsx";
import ManageContributions from "../pages/admin/ManageContributions.jsx";
import ManageDownloads from "../pages/admin/ManageDownloads.jsx";
import UploadDownload from "../pages/admin/UploadDownload.jsx";
import ManageResources from "../pages/admin/ManageResources.jsx";
import UploadResource from "../pages/admin/UploadResource.jsx";
import Settings from "../pages/admin/Settings.jsx";

function NotFound() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for was not found.
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />

      <Route
  path="/about/history-and-values"
  element={<HistoryAndValues />}
/>

<Route
  path="/about/our-team"
  element={<OurTeam />}
/>

<Route
  path="/about/our-locations"
  element={<OurLocations />}
/>

      {/* Public events */}
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventsDetails />} />

      {/* Public news */}
      <Route path="/news" element={<News />} />
      <Route path="/news/:id" element={<NewsDetails />} />

      {/* Public resources and document reader */}
      <Route path="/resources" element={<Resources />} />
      <Route
        path="/resources/:id/read"
        element={<ResourceReader />}
      />

      {/* Other public pages */}
      <Route path="/contact" element={<Contact />} />
      <Route path="/donate" element={<Donate />} />

      {/* Grassroots pages */}
      <Route
        path="/grassroots-elections"
        element={<h1>Grassroots Elections</h1>}
      />
      <Route
        path="/grassroots"
        element={<h1>Grassroots</h1>}
      />

      {/* Authentication pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected administrator routes */}
      <Route element={<ProtectedRoutes />}>
        <Route element={<RoleRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Dashboard */}
            <Route index element={<AdminDashboard />} />
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* News management */}
            <Route path="news" element={<ManageNews />} />
            <Route path="news/add" element={<AddNews />} />
            <Route
              path="news/edit/:id"
              element={<EditNews />}
            />

            {/* Event management */}
            <Route path="events" element={<ManageEvents />} />
            <Route path="events/add" element={<AddEvent />} />
            <Route
              path="events/edit/:id"
              element={<EditEvent />}
            />

            {/* Members and contributions */}
            <Route path="members" element={<ManageMembers />} />
            <Route
              path="contributions"
              element={<ManageContributions />}
            />
             {/* Contact messages */}
          <Route path="messages" element={<Messages />} />

            {/* Downloads management */}
            <Route
              path="downloads"
              element={<ManageDownloads />}
            />
            <Route
              path="downloads/upload"
              element={<UploadDownload />}
            />

            {/* Admin resource management */}
            <Route
              path="resources"
              element={<ManageResources />}
            />
            <Route
              path="resources/upload"
              element={<UploadResource />}
            />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
