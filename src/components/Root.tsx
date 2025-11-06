import { ErrorBoundary, type Component, Switch, Match } from "solid-js";

import { App } from "@/components/App.js";

export const Root: Component = () => {
  return (
    <ErrorBoundary
      fallback={(err) => {
        console.error("ErrorBoundary handled error:", err);

        return (
          <div
            style={{
              padding: "20px",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              "border-radius": "var(--radius-md)",
              margin: "20px",
            }}
          >
            <p style={{ "font-weight": "bold", "margin-bottom": "10px" }}>
              Error:
            </p>
            <code
              style={{
                display: "block",
                padding: "10px",
                background: "var(--bg-primary)",
                "border-radius": "var(--radius-sm)",
                "font-size": "var(--text-sm)",
              }}
            >
              <Switch fallback={JSON.stringify(err)}>
                <Match when={typeof err === "string" ? err : false}>
                  {(v) => v()}
                </Match>
                <Match when={err instanceof Error ? err.message : false}>
                  {(v) => v()}
                </Match>
              </Switch>
            </code>
          </div>
        );
      }}
    >
      <App />
    </ErrorBoundary>
  );
};
