import { ConfigProvider } from "antd";
import { RouterProvider } from "react-router-dom";
import ptBR from "antd/locale/pt_BR";
import router from "./routes";
import themeConfig from "./theme/themeConfig";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <ConfigProvider theme={themeConfig} locale={ptBR}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  );
}
