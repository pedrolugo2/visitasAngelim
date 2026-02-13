import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { Button, Result } from "antd";
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";
import HomePage from "../pages/public/HomePage";
import LeadsPage from "../pages/admin/LeadsPage";

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
      { path: "agendar", element: <div style={{ padding: 48, textAlign: "center" }}>Agendamento de visitas — em breve</div> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <div>Painel — em breve</div> },
      { path: "leads", element: <LeadsPage /> },
      { path: "visits", element: <div>Visitas — em breve</div> },
      { path: "availability", element: <div>Disponibilidade — em breve</div> },
      { path: "chat", element: <div>Chat — em breve</div> },
    ],
  },
]);

export default router;
