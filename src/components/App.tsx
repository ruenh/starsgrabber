import { Navigate, Route, HashRouter } from "@solidjs/router";
import { For, Component } from "solid-js";

import { routes } from "@/navigation/routes.js";
import { BottomNav } from "@/components/layout/BottomNav.js";

export const App: Component = () => {
  return (
    <HashRouter>
      <div class="app-container">
        <main class="main-content">
          <For each={routes}>
            {(route) => <Route path={route.path} component={route.Component} />}
          </For>
          <Route path="*" component={() => <Navigate href="/" />} />
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
};
