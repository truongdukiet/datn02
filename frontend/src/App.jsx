import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout/AppLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";

// ✅ Client Pages
import Home from "./pages/client/Home/Home";
import About from "./pages/client/About/About";
import Projects from "./pages/client/Projects/Projects";
import News from "./pages/client/News/News";
import NewsDetail from "./pages/client/News/NewsDetail"; // ✅ Chi tiết tin tức
import Services from "./pages/client/Services/Services";
import Contact from "./pages/client/Contact/Contact";
import Login from "./pages/client/Login/Login";
import Register from "./pages/client/Register/Register";
import Products from "./pages/client/Products/Products";
import ProductDetail from "./pages/client/ProductDetail/ProductDetail";
import ThankYou from "./pages/client/ThankYou/ThankYou";
import VerifyEmail from "./pages/client/VerifyEmail/VerifyEmail";
import ForgotPassword from "./pages/client/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/client/ResetPassword/ResetPassword";
import Checkout from "./pages/client/Checkout/Checkout";
import Cart from "./pages/client/Cart/Cart";
// ✅ Favorites & Profile
import Favorites from "./pages/client/Favorites/Favorites";
import ProfilePage from "./pages/client/ProfilePage/ProfilePage";

// ✅ Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/AdminDashboard";
import AdminUser from "./pages/admin/AdminUsers";
import AdminOrder from "./pages/admin/AdminOrders";
import AdminProduct from "./pages/admin/AdminProducts";
import AdminCategory from "./pages/admin/categories/AdminCategory";
import AdminVoucher from "./pages/admin/vouchers/AdminVoucher";
import AdminNews from "./pages/admin/news/AdminNews";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.Role == 1;

  // ✅ Route bảo vệ Admin
  const ProtectedAdminRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to="/" />;
  };

  // ✅ Route bảo vệ đăng nhập
  const ProtectedUserRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <AppLayout />,
      children: [
        // ✅ Client routes
        {
          path: "",
          element: <MainLayout />,
          children: [
            { path: "", element: <Home /> },
            { path: "about", element: <About /> },
            { path: "projects", element: <Projects /> },
            { path: "news", element: <News /> },
            { path: "news/:id", element: <NewsDetail /> },
            { path: "services", element: <Services /> },
            { path: "contact", element: <Contact /> },
            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "verify-email", element: <VerifyEmail /> },
            { path: "forgot-password", element: <ForgotPassword /> },
            { path: "reset-password", element: <ResetPassword /> },
            { path: "products", element: <Products /> },
            { path: "products/:id", element: <ProductDetail /> },
            { path: "cart", element: <Cart /> },
            {
              path: "checkout",
              element: (
                <ProtectedUserRoute>
                  <Checkout />
                </ProtectedUserRoute>
              ),
            },
            { path: "thank-you", element: <ThankYou /> },

            // ✅ Favorites
            { path: "favorites", element: <Favorites /> },

            // ✅ Profile bảo vệ đăng nhập
            {
              path: "profile",
              element: (
                <ProtectedUserRoute>
                  <ProfilePage />
                </ProtectedUserRoute>
              ),
            },
          ],
        },

        // ✅ Admin routes
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: (
                <ProtectedAdminRoute>
                  <Dashboard />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "users",
              element: (
                <ProtectedAdminRoute>
                  <AdminUser />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedAdminRoute>
                  <AdminOrder />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "products",
              element: (
                <ProtectedAdminRoute>
                  <AdminProduct />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "categories",
              element: (
                <ProtectedAdminRoute>
                  <AdminCategory />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "vouchers",
              element: (
                <ProtectedAdminRoute>
                  <AdminVoucher />
                </ProtectedAdminRoute>
              ),
            },
            {
              path: "news",
              element: (
                <ProtectedAdminRoute>
                  <AdminNews />
                </ProtectedAdminRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
