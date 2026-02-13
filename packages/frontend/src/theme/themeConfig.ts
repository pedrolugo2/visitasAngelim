import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    colorPrimary: "#5B8C5A",
    colorInfo: "#6BA3BE",
    colorSuccess: "#5B8C5A",
    colorWarning: "#E8C547",
    colorError: "#B0766C",
    colorBgBase: "#FDF8F0",
    colorTextBase: "#3E2723",
    borderRadius: 8,
    fontFamily:
      "'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  },
  components: {
    Layout: {
      siderBg: "#3E2723",
      headerBg: "#FDF8F0",
      bodyBg: "#FDF8F0",
    },
    Menu: {
      darkItemBg: "#3E2723",
      darkItemSelectedBg: "#5B8C5A",
    },
  },
};

export default themeConfig;
