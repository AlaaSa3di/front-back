import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  Contact,
  About,
  Login,
  Navbar,
  Profile,
  Register,
  PageNotFound,
  SpaceForm,
  ScreensListing,
  Search,
  BookingForm,
  Footer,
  Pricing,
  TermsAndPolicy,
} from "./Components";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";


// NEW IMPORTS:
import AdminLayout from "./Components/AdminDashboard/AdminLayout";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";
import SpaceManagement from "./Components/AdminDashboard/spaceManage";
import AddScreen from './Components/AdminDashboard/Screens/AddScreen';
import BookingsPage from './Components/AdminDashboard/Bookings';
import UserManagement from './Components/AdminDashboard/UserManagement';
import ContactMessages from './Components/AdminDashboard/ContactMessages';
import ScreensList from './Components/AdminDashboard/Screens/ScreensList';
import ScreenDetails from './Components/AdminDashboard/Screens/ScreenDetails';
import EditScreen from './Components/AdminDashboard/Screens/EditScreen';
import HeroEditor from './Components/AdminDashboard/HeroEditor';
import Overview from './Components/AdminDashboard/Overview';
import ProtectedRoute from "./Components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Navbar />
          <Footer />
        </>
      ),
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
          path: "/search",
          element: <Search />,
        },
        {
          path: "/Contact",
          element: <Contact />,
        },
        {
          path: "/About",
          element: <About/>,
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
          path: "/pricing",
          element: <Pricing />,
        },
         {
          path: "/terms",
          element: <TermsAndPolicy />,
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
    {
      path: "/admin",
      element: (
        <ProtectedRoute requiredRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <AdminDashboard /> },
        { path: "over", element: <Overview /> },
        { path: "spaces", element: <SpaceManagement /> },
        { path: "bookings", element: <BookingsPage /> },
        { path: "users", element: <UserManagement /> },
        { path: "spaces/:spaceId/add-screen", element: <AddScreen /> },
        { path: "screens", element: <ScreensList /> },
        { path: "screens/:id", element: <ScreenDetails /> },
        { path: "screens/:id/edit", element: <EditScreen /> },
        { path: "contact-messages", element: <ContactMessages/>},
        { path: "hero", element: <HeroEditor/>}
      ],
      errorElement: <PageNotFound />,
    },
  ]);

  return (
    <PayPalScriptProvider 
      options={{
        "client-id": "AW9NjhRjuUfEcFQhQRu6mm49nlQVfMQtmWHap7o24_0EnOqyWC3HRJqRJe0gr8to9uss_jAc9AUuw4dr", 
        currency: "USD",
        intent: "capture"
      }}>
      <RouterProvider router={router} />
    </PayPalScriptProvider>
  );
}

export default App;
