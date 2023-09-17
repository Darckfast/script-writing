<script lang="ts">
  import { remove } from "@/functions/node.utils/nodes.utils";
  import { slide } from "svelte/transition";
  import { Background, Svelvet } from "svelvet";
  import ShowHideButton from "../../../components/buttons/ShowHideButton.svelte";
  import Header from "../../../components/headers/Header.svelte";
  import PropAnchor from "../../../components/props/Anchor.svelte";
  import PropsMenu from "../../../components/props/Menu.svelte";
  import Passage from "../../../components/props/Passage.svelte";
  import {
    calculateLeafPositions,
    getPropsAsObject,
    stories,
    storiesFetching,
    storiesSync,
  } from "../../../lib/stores/stories";

  export let storyIndex: string;

  let sorting = false;
  let showAddMenu = false;

  $: story = $stories[storyIndex] as StoryNode;

  const addNode = ({ detail: nodeToAdd }: CustomEvent<StoryNode>) => {
    nodeToAdd.name = story.passages.length + 1;

    story.latestPid ||= 1;
    story.latestPid++;

    story.passages.push(nodeToAdd);
  };

  const deleteNode = (node: StoryNode) => {
    if (story.passages.length !== 1) {
      story.passages = [...remove({ nodes: story.passages, removeNode: node })];
      return;
    }

    story.passages[0] = {
      cleanText: "",
      links: [],
      name: 1,
      pid: 1,
    };
  };

  const changeRoot = (index: number) => {
    const current = story.passages[index];
    story.passages.splice(index, 1, story.passages[0]);
    story.passages[0] = current;

    story.passages = [...story.passages];
  };

  const organizeNodes = () => {
    sorting = true;
    calculateLeafPositions(story.passages, story.ifid);

    story.passages = [...story.passages];

    setTimeout(() => {
      sorting = false;
    }, 1);
  };
</script>

<div class="w-full h-full overflow-hidden flex flex-wrap">
  <Header
    onSync={storiesSync}
    isFetching={storiesFetching}
    onOrganize={organizeNodes}
    headerName={story?.storyName}
    onReturn={() => ($stories = [...$stories])}
    id={story?.ifid}
  />

  <div
    class={`${showAddMenu ? "w-2/3" : "w-full"} relative transition-all`}
    style="height: 90%;"
  >
    <Svelvet theme="dark">
      {#if story && !sorting}
        {#each story.passages as node, index (node.pid)}
          <Passage
            let:showProps
            let:removeProp
            bind:node
            isRoot={index === 0}
            on:addNode={addNode}
            on:cloneNode={addNode}
            on:changeRoot={() => changeRoot(index)}
            on:remove={() => deleteNode(node)}
          >
            {#if showProps}
              {#each getPropsAsObject(node, story.ifid) as prop}
                <PropAnchor onRemove={removeProp} {prop} />
              {/each}
            {/if}
          </Passage>
        {/each}
      {/if}

      <Background
        dotColor="#fff"
        bgColor="transparent"
        gridWidth={40}
        dotSize={3}
        slot="background"
      />
    </Svelvet>

    <ShowHideButton
      class="absolute right-4 bottom-1/2 w-6"
      bind:show={showAddMenu}
    />
  </div>

  {#if showAddMenu}
    <div class="w-1/3" style="height: 90%;" transition:slide={{ axis: "x" }}>
      <PropsMenu />
    </div>
  {/if}
</div>
