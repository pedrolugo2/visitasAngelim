import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { Button, Result } from "antd";
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import HomePage from "../pages/public/HomePage";
import BookingPage from "../pages/public/BookingPage";
import TeacherAvailabilityPage from "../pages/public/TeacherAvailabilityPage";
import LoginPage from "../pages/admin/LoginPage";
import DashboardPage from "../pages/admin/DashboardPage";
import LeadsPage from "../pages/admin/LeadsPage";
import AvailabilityPage from "../pages/admin/AvailabilityPage";
import VisitsPage from "../pages/admin/VisitsPage";
import ChatPage from "../pages/admin/ChatPage";

function ErrorBoundary() {
  const error = useRouteError() as Error & { status?: number };
  const is404 = error && "status" in error && error.status === 404;

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Result
        status={is404 ? "404" : "error"}
        title={is404 ? "Página não encontrada" : "Algo deu errado"}
        subTitle={is404 ? "A página que você procura não existe." : (error?.message || "Erro inesperado na aplicação.")}
        extra={
          <Link to="/">
            <Button type="primary">Voltar ao início</Button>
          </Link>
        }
      />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "agendar", element: <BookingPage /> },
      { path: "professor-disponibilidade", element: <TeacherAvailabilityPage /> },
    ],
  },
  {
    path: "/admin/login",
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "leads", element: <LeadsPage /> },
          { path: "visits", element: <VisitsPage /> },
          { path: "availability", element: <AvailabilityPage /> },
          { path: "chat", element: <ChatPage /> },
        ],
      },
    ],
  },
]);

export default router;
