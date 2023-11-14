<script lang="ts">
  import { params } from "@roxi/routify";
  import {
    Background,
    BackgroundVariant,
    Controls,
    SvelteFlow,
    useSvelteFlow,
  } from "@xyflow/svelte";
  import "@xyflow/svelte/dist/style.css";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { slide } from "svelte/transition";
  import ShowHideButton from "../../../components/buttons/ShowHideButton.svelte";
  import Header from "../../../components/headers/Header.svelte";
  import PropsMenu from "../../../components/props/Menu.svelte";
  import Passage from "../../../components/props/Passage.svelte";
  import Prop from "../../../components/props/Prop.svelte";
  import {
    getPropsAsObject,
    stories,
    storiesFetching,
    storiesSync,
  } from "../../../lib/stores/stories";

  $: storyIndex = $params.storyIndex;

  let showAddMenu = false;

  $: story = $stories[storyIndex] as StoryNode;
  let connectingNodeId = "0";

  interface BaseNode {
    id: string;
    position: { x: number; y: number };
    type: string;
    data: {
      index: number;
      storyIndex: number;
    };
  }
  const nodeTypes = {
    passage: Passage,
    prop: Prop,
  };

  const nodes = writable<BaseNode[]>([]);

  interface TEdge {
    id: string;
    source: string;
    target: string;
  }

  const edges = writable<TEdge[]>([]);

  function updateEdges() {
    if ($stories[storyIndex] === undefined) return;

    const nodesTmp = [];
    const edgesTmp = [];

    for (let i = 0; i < $stories[storyIndex].passages.length; i++) {
      const passage = $stories[storyIndex].passages[i];

      const props = getPropsAsObject(passage);

      if (props.length > 0) {
        for (let j = 0; j < props.length; j++) {
          const prop = props[j];

          const propPosition = { x: -350, y: j * 50 };

          nodesTmp.push({
            id: `prop-${prop.name}-${passage.pid}`,
            position: propPosition,
            parentNode: `${passage.pid}`,
            type: "prop",
            deletable: false,
            data: {
              index: i,
              passagePid: passage.pid,
              propName: prop.name,
              storyIndex,
            },
          });

          edgesTmp.push({
            id: `prop-${prop.name}-${passage.pid}`,
            source: `${passage.pid}`,
            sourceHandle: `prop-${passage.pid}`,
            target: `prop-${prop.name}-${passage.pid}`,
          });
        }
      }

      nodesTmp.push({
        id: `${passage.pid}`,
        position: passage.position ?? { x: 0, y: i * 150 },
        type: "passage",
        dragHandle: ".drag-handle",
        deletable: false,
        data: {
          index: i,
          passagePid: passage.pid,
          storyIndex,
        },
      });

      if (passage.links.length > 0) {
        for (let j = 0; j < passage.links.length; j++) {
          const link = passage.links[j];

          edgesTmp.push({
            id: `${link.pid}-${passage.pid}`,
            target: `${passage.pid}`,
            source: `${link.pid}`,
          });
        }
      }
    }

    $edges = edgesTmp;
    $nodes = nodesTmp;
  }

  onMount(() => {
    updateEdges();

    document.addEventListener("updateedges", updateEdges);

    return () => {
      document.removeEventListener("updateedges", updateEdges);
    };
  });

  $: if ($stories[storyIndex] !== undefined) {
    for (let j = 0; j < $nodes.length; j++) {
      const node = $nodes[j].data;

      $stories[storyIndex].passages[node.index].links = [];
    }

    for (let i = 0; i < $edges.length; i++) {
      if ($edges[i].id.startsWith("prop")) continue;

      let sourceNode = -1;
      let targetNode = -1;

      for (let j = 0; j < $nodes.length; j++) {
        if ($nodes[j].id === $edges[i].source) {
          sourceNode = $nodes[j].data.index;
        }

        if ($nodes[j].id === $edges[i].target) {
          targetNode = $nodes[j].data.index;
        }

        if (sourceNode !== -1 && targetNode !== -1) break;
      }

      if (sourceNode === -1) {
        console.log("source not found");
        continue;
      }

      const targetPid = $stories[storyIndex].passages[sourceNode].pid;
      $stories[storyIndex].passages[targetNode].links.push({
        pid: targetPid,
      });
    }
  }

  $: if ($stories[storyIndex] !== undefined) {
    for (let i = 0; i < $nodes.length; i++) {
      const { index: passageIndex } = $nodes[i].data;

      $stories[storyIndex].passages[passageIndex].position = $nodes[i].position;
    }

    $stories = $stories;
  }

  const { screenToFlowPosition } = useSvelteFlow();

  function addNode({ detail: { event } }: { detail: { event: MouseEvent } }) {
    const targetIsPane = event.target?.classList.contains("svelte-flow__pane");

    if (!targetIsPane) return;

    const index = $stories[storyIndex].passages.length;
    let lastPid = $stories[storyIndex].latestPid ?? 0;

    lastPid = lastPid + 1;

    $nodes.push({
      id: `${lastPid}`,
      position: screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      }),
      type: "passage",
      dragHandle: ".drag-handle",
      deletable: false,
      origin: [0.5, 0.0],
      data: {
        index,
        passagePid: lastPid,
        storyIndex,
      },
    });

    $edges.push({
      target: connectingNodeId,
      source: `${lastPid}`,
      id: `${connectingNodeId}-${lastPid}`,
    });

    let parentNode: BaseNode | undefined = undefined;

    for (let i = 0; i < $nodes.length; i++) {
      const node = $nodes[i];

      if (node.id === connectingNodeId) {
        parentNode = node;
        break;
      }
    }

    if (!parentNode) return;

    const linkPid = {
      pid: lastPid,
    };

    $stories[storyIndex].passages.push({
      pid: lastPid,
      links: [],
      name: lastPid,
      cleanText: "",
      position: {
        x: event.clientX,
        y: event.clientY,
      },
    });
    $stories[storyIndex].latestPid = lastPid;
    $stories[storyIndex].passages[parentNode.data.index].links.push(linkPid);

    $stories = $stories;
    $nodes = $nodes;
    $edges = $edges;
  }
</script>

<div class="w-full h-full overflow-hidden flex flex-wrap text-black relative">
  <Header
    onSync={storiesSync}
    isFetching={storiesFetching}
    headerName={story?.storyName}
    onReturn={() => ($stories = [...$stories])}
    id={story?.ifid}
  />

  <SvelteFlow
    fitView
    {edges}
    {nodes}
    {nodeTypes}
    class="!bg-transparent"
    on:connectstart={({ detail: { nodeId } }) => {
      connectingNodeId = nodeId;
    }}
    on:connectend={addNode}
  >
    <Controls />
    <Background variant={BackgroundVariant.Dots} />
  </SvelteFlow>

  <div
    class="absolute right-0 w-6 h-full flex justify-end items-center"
    class:w-96={showAddMenu}
  >
    <ShowHideButton class="w-6 text-white" bind:show={showAddMenu} />

    {#if showAddMenu}
      <div
        class="w-full self-end mb-2 mr-2 text-white backdrop-blur-3xl"
        style="height: 90%;"
        transition:slide={{ axis: "x" }}
      >
        <PropsMenu />
      </div>
    {/if}
  </div>
</div>
