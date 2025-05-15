import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  ArticleDetails,
  Bookmark,
  Categories,
  Contact,
  About,
  Login,
  Navbar,
  NewsArticleCreation,
  Profile,
  Register,
  ToBeJournalist,
  PageNotFound,
  SpaceForm,
  ScreensListing,
  BookingForm
} from "./Components";
import Footer from "./Components/Footer/Footer";

// NEW IMPORTS:
import AdminLayout from "./Components/AdminDashboard/AdminLayout";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
// import AdminUsers from "./Components/AdminDashboard/AdminUsers";
// import ArticlesList from "./Components/AdminDashboard/ArticlesList";
import SpaceManagement from "./Components/AdminDashboard/spaceManage";
import AddScreen from './Components/AdminDashboard/AddScreen';
import BookingsPage from './Components/AdminDashboard/Bookings';
import UserManagement from './Components/AdminDashboard/UserManagement';
import ContactMessages from './Components/AdminDashboard/ContactMessages';
// import AdminArticleDetails from "./Components/AdminDashboard/AdminArticleDetails";
// import ProtectedRoute from "./Components/ProtectedRoute";
import AboutUs from "./Components/About/About";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/",
          element: <Home />,
          errorElement: <PageNotFound />,
        },
        {
          path: "/ArticleDetails/:id",
          element: <ArticleDetails />,
        },
        {
          path: "/Bookmark",
          element: <Bookmark />,
        },
        {
          path: "/Categories",
          element: <Categories />,
        },
        {
          path: "/Contact",
          element: <Contact />,
        },
        {
          path: "/About",
          element: <AboutUs />,
        },
        {
          path: "/ToBeJournalist",
          element: <ToBeJournalist />,
        },
        {
          path: "/Profile/:id",
          element: <Profile />,
        },
        {
          path: "/space",
          element: <SpaceForm />,
        },
        {
          path: "/screens",
          element: <ScreensListing />,
        },
        {
          path: "/booking/:screenId",
          element: <BookingForm />,
        },
        {
          path: "/NewsArticleCreation",
          element: <NewsArticleCreation />,
        },
      ],
      errorElement: <PageNotFound />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/Register",
      element: <Register />,
    },
    // ----------------------------------
    // Add the Admin route here:
    {
      path: "/admin",
      element: (
        // <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        // </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "spaces", element: <SpaceManagement /> },
        { path: "bookings", element: <BookingsPage /> },
        { path: "users", element: <UserManagement /> },
        { path: "spaces/:spaceId/add-screen", element: <AddScreen /> },
        { path: "contact-messages", element: <ContactMessages/>} // <--- This route
        // { path: "users", element: <AdminUsers /> },
      ],
      errorElement: <PageNotFound />,
    },
    // ----------------------------------
  ]);

  return (
    <>
      <RouterProvider router={router} />
      {/* <Footer /> */}
    </>
  );
}

export default App;
