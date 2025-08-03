import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout/AppLayout";
import MainLayout from "./layouts/MainLayout/MainLayout";
import Home from "./pages/client/Home/Home";
import About from "./pages/client/About/About";
import Projects from "./pages/client/Projects/Projects";
import News from "./pages/client/News/News";
import Services from "./pages/client/Services/Services";
import Contact from "./pages/client/Contact/Contact";
import Login from "./pages/client/Login/Login";
import Register from "./pages/client/Register/Register";
import Products from "./pages/client/Products/Products";
import ProductDetail from "./pages/client/ProductDetail/ProductDetail";
import Cart from "./pages/client/Cart/Cart";
import Checkout from "./pages/client/Checkout/Checkout";
import ThankYou from "./pages/client/ThankYou/ThankYou";
import VerifyEmail from "./pages/client/VerifyEmail/VerifyEmail";
import ForgotPassword from "./pages/client/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/client/ResetPassword/ResetPassword";

// ✅ Thêm import trang Favorites
import Favorites from "./pages/client/Favorites/Favorites";

import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard/AdminDashboard";
import AdminUser from "./pages/admin/AdminUsers";
import AdminOrder from "./pages/admin/AdminOrders";
import AdminProduct from "./pages/admin/AdminProducts";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.Role == 1; // Kiểm tra xem người dùng có phải là admin không

  const ProtectedRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to="/" />;
  };

  const router = createBrowserRouter([
    {
      path: "",
      element: <AppLayout />,
      children: [
        // client routes
        {
          path: "",
          element: <MainLayout />,
          children: [
            { path: "", element: <Home /> },
            { path: "about", element: <About /> },
            { path: "projects", element: <Projects /> },
            { path: "news", element: <News /> },
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
            { path: "checkout", element: <Checkout /> },
            { path: "thank-you", element: <ThankYou /> },

            // ✅ Thêm route mới cho Sản phẩm yêu thích
            { path: "favorites", element: <Favorites /> },
          ],
        },

        // admin routes
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            {
              path: "",
              element: (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ),
            },
            {
              path: "users",
              element: (
                <ProtectedRoute>
                  <AdminUser />
                </ProtectedRoute>
              ),
            },
            {
              path: "orders",
              element: (
                <ProtectedRoute>
                  <AdminOrder />
                </ProtectedRoute>
              ),
            },
            {
              path: "products",
              element: (
                <ProtectedRoute>
                  <AdminProduct />
                </ProtectedRoute>
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
