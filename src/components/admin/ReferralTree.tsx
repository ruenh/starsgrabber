import { Component, createSignal, onMount, For, Show } from "solid-js";
import { adminApi } from "@/services/api.js";

interface ReferralNode {
  userId: number;
  username?: string;
  firstName: string;
  referralCount: number;
  totalEarnings: number;
  children?: ReferralNode[];
}

export const ReferralTree: Component = () => {
  const [tree, setTree] = createSignal<ReferralNode[]>([]);
  const [isLoading, setIsLoading] = createSignal(true);
  const [error, setError] = createSignal<string | null>(null);
  const [expandedNodes, setExpandedNodes] = createSignal<Set<number>>(
    new Set()
  );

  const loadTree = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminApi.getReferralTree();
      setTree(response.tree);
    } catch (err: any) {
      console.error("Failed to load referral tree:", err);
      setError(err.message || "Ошибка загрузки дерева рефералов");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    loadTree();
  });

  const toggleNode = (userId: number) => {
    const expanded = new Set(expandedNodes());
    if (expanded.has(userId)) {
      expanded.delete(userId);
    } else {
      expanded.add(userId);
    }
    setExpandedNodes(expanded);
  };

  const isExpanded = (userId: number) => expandedNodes().has(userId);

  const ReferralNodeComponent: Component<{
    node: ReferralNode;
    level: number;
  }> = (props) => {
    const hasChildren = () =>
      props.node.children && props.node.children.length > 0;

    return (
      <div
        class="referral-tree-node"
        style={{ "margin-left": `${props.level * 20}px` }}
      >
        <div class="referral-tree-node-content card">
          <div class="referral-tree-node-header">
            <Show when={hasChildren()}>
              <button
                class="referral-tree-toggle"
                onClick={() => toggleNode(props.node.userId)}
              >
                {isExpanded(props.node.userId) ? "▼" : "▶"}
              </button>
            </Show>
            <div class="referral-tree-node-info">
              <p class="referral-tree-node-name">
                {props.node.username
                  ? `@${props.node.username}`
                  : props.node.firstName}
              </p>
              <p class="referral-tree-node-id text-secondary">
                ID: {props.node.userId}
              </p>
            </div>
            <div class="referral-tree-node-stats">
              <div class="referral-tree-stat">
                <span class="referral-tree-stat-label text-secondary">
                  Рефералов:
                </span>
                <span class="referral-tree-stat-value">
                  {props.node.referralCount}
                </span>
              </div>
              <div class="referral-tree-stat">
                <span class="referral-tree-stat-label text-secondary">
                  Заработано:
                </span>
                <span class="referral-tree-stat-value text-green">
                  ⭐ {props.node.totalEarnings}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Show when={hasChildren() && isExpanded(props.node.userId)}>
          <div class="referral-tree-children">
            <For each={props.node.children}>
              {(child) => (
                <ReferralNodeComponent node={child} level={props.level + 1} />
              )}
            </For>
          </div>
        </Show>
      </div>
    );
  };

  return (
    <div class="referral-tree">
      <div class="referral-tree-header">
        <h2 class="referral-tree-title">Дерево рефералов</h2>
        <button class="btn btn-secondary" onClick={loadTree}>
          🔄 Обновить
        </button>
      </div>

      <Show when={error()}>
        <div class="referral-tree-error">
          <p class="text-red">{error()}</p>
          <button class="btn btn-secondary" onClick={() => setError(null)}>
            Закрыть
          </button>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="referral-tree-loading">
          <p class="text-secondary">Загрузка дерева рефералов...</p>
        </div>
      </Show>

      <Show when={!isLoading()}>
        <div class="referral-tree-content">
          <For
            each={tree()}
            fallback={
              <div class="referral-tree-empty">
                <p class="text-secondary">Нет данных о рефералах</p>
              </div>
            }
          >
            {(node) => <ReferralNodeComponent node={node} level={0} />}
          </For>
        </div>
      </Show>
    </div>
  );
};
