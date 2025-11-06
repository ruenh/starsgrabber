import type { Component } from "solid-js";

import { HomePage } from "@/pages/HomePage.js";
import { ProfilePage } from "@/pages/ProfilePage.js";
import { ReferralsPage } from "@/pages/ReferralsPage.js";
import { AdminPage } from "@/pages/AdminPage.js";

interface Route {
  path: string;
  Component: Component;
  title?: string;
}

export const routes: Route[] = [
  { path: "/", Component: HomePage, title: "Home" },
  { path: "/profile", Component: ProfilePage, title: "Profile" },
  { path: "/referrals", Component: ReferralsPage, title: "Referrals" },
  { path: "/admin", Component: AdminPage, title: "Admin" },
];
