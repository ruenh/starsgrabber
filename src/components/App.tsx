import { Navigate, Route, HashRouter } from "@solidjs/router";
import { Component } from "solid-js";

import { BottomNav } from "@/components/layout/BottomNav.js";
import { HomePage } from "@/pages/HomePage.js";
import { ProfilePage } from "@/pages/ProfilePage.js";
import { ReferralsPage } from "@/pages/ReferralsPage.js";
import { AdminPage } from "@/pages/AdminPage.js";

const Layout: Component<{ children?: any }> = (props) => {
  return (
    <div class="app-container">
      <main class="main-content">{props.children}</main>
      <BottomNav />
    </div>
  );
};

export const App: Component = () => {
  return (
    <HashRouter root={Layout}>
      <Route path="/" component={HomePage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/referrals" component={ReferralsPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="*" component={() => <Navigate href="/" />} />
    </HashRouter>
  );
};
