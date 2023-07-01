import { AuthBindings, Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";

import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  PeopleAltOutlined,
  StarOutlineRounded,
  VillaOutlined,
} from "@mui/icons-material";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { CredentialResponse } from "interfaces/google";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "pages/categories";
import {
  Login,
  Home,
  MyProfile,
  Agents,
  AgentProfile,
  AllProperties,
  CreateProperty,
  Editproperty,
  PropertyDetail,
} from "pages";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { parseJwt } from "utils/parse-jwt";
import { Header } from "./components/layout/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Sider, Title } from "components";
import { MuiInferencer } from "@refinedev/inferencer/mui";
import { ThemeProvider } from "@mui/material";
import { theme } from "utils/customThemes";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const { t, i18n } = useTranslation();

  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj) {
        const response = await fetch("http://localhost:8080/api/v1/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: profileObj.name,
            email: profileObj.email,
            avatar: profileObj.picture,
          }),
        });
        const data = await response.json();
        console.log("dt: " + JSON.stringify(data));

        if (response.status === 200) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...profileObj,
              avatar: profileObj.picture,
              userid: data._id,
            })
          );
        } else {
          return Promise.reject();
        }

        localStorage.setItem("token", `${credential}`);

        return {
          success: true,
          redirectTo: "/",
        };
      }

      return {
        success: false,
      };
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      console.log("res", user);
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("http://localhost:8080/api/v1")}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "properties",
                  list: "/properties",
                  show: "/properties/show/:id",
                  create: CreateProperty,
                  edit: Editproperty,
                  meta: {
                    icon: <VillaOutlined />,
                    canDelete: true,
                  },
                },
                {
                  name: "agent",
                  list: "/agent",
                  show: "/agent/show/:id",
                  meta: {
                    icon: <PeopleAltOutlined />,
                  },
                },
                {
                  name: "review",
                  list: Home,
                  meta: {
                    icon: <StarOutlineRounded />,
                  },
                },
                {
                  name: "message",
                  list: Home,
                  meta: {
                    icon: <ChatBubbleOutline />,
                  },
                },
                {
                  name: "my-profile",
                  meta: {
                    icon: <AccountCircleOutlined />,
                    label: "My-Profile",
                  },
                  list: "/my-profile",
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}>
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2
                        Header={() => <Header />}
                        Sider={() => (
                          <Sider Title={() => <Title collapsed={true} />} />
                        )}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }>
                  <Route
                    element={<NavigateToResource resource="dashboard" />}
                  />
                  <Route path="/">
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="properties">
                    <Route index element={<AllProperties />} />
                    <Route path="create" element={<CreateProperty />} />
                    <Route path="edit/:id" element={<Editproperty />} />
                    <Route path="show/:id" element={<PropertyDetail />} />
                  </Route>
                  <Route path="agent">
                    <Route index element={<Agents />} />
                    <Route path="show/:id" element={<AgentProfile />} />
                  </Route>
                  <Route path="/review">
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="/message">
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="my-profile">
                    <Route index element={<MyProfile />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }>
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

//                   name: "blog_posts",
//                   list: "/blog-posts",
//                   create: "/blog-posts/create",
//                   edit: "/blog-posts/edit/:id",
//                   show: "/blog-posts/show/:id",
//                   meta: {
//                     canDelete: true,
//                   },
