<script lang="ts">
  import { genColor } from "@/functions/colors/colorGen";
  import type { syncs } from "@/functions/wailsjs/go/models";
  import { stories } from "@/stores/stories";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import Spinner from "../../styles/icons/spinner.svelte";
  import Trash from "../../styles/icons/trash.svelte";
  import AddButton from "../buttons/AddButton.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";
  import AddMenu from "./AddMenu.svelte";

  type $$Props = NodeProps;

  export let data: $$Props["data"];

  const updateEdgeEvent = new Event("updateedges");
  let showPropsAvailable = false;
  let imagePrm: Promise<syncs.Result> | undefined;

  $: node = $stories[data.storyIndex].passages[data.index];
  let isRoot = data.index === 0;

  function addProp(e: CustomEvent<TPropForm>) {
    $stories[data.storyIndex].passages[data.index][e.detail.name] =
      e.detail.value;

    document.dispatchEvent(updateEdgeEvent);
  }

  function removeNode() {
    const pid = data.passagePid;

    $stories[data.storyIndex].passages.splice(data.index, 1);

    for (let i = 0; i < $stories[data.storyIndex].passages.length; i++) {
      const passage = $stories[data.storyIndex].passages[i];

      for (let j = 0; j < passage.links.length; j++) {
        const { pid: linkPid } = passage.links[j];

        if (linkPid === pid) {
          $stories[data.storyIndex].passages[i].links.splice(j, 1);
        }
      }
    }

    $stories = $stories;

    document.dispatchEvent(updateEdgeEvent);
  }
</script>

{#if node}
  <div class="flex flex-col p-2 relative h-fit w-80 shadow bg-primary rounded">
    <span class="absolute top-2 left-2 text-white">{node.pid}</span>
    <textarea
      bind:value={node.cleanText}
      class="text-center text-white w-full min-h-8 h-full outline-none p-2 bg-transparent"
    />
    {#if node.image && imagePrm}
      {#await imagePrm}
        <div class="flex h-96">
          <Spinner />
        </div>
      {:then result}
        <img
          src={result.content}
          alt="message"
          style="width: 20rem;"
          loading="lazy"
          data-lazy-load
        />
      {:catch}
        <img
          src="/unicorn.svg"
          alt="error"
          style="width: 100%;"
          loading="lazy"
          data-lazy-load
        />
      {/await}
    {/if}
    <span
      class="drag-handle w-5 h-5 bg-white absolute rounded-full -left-2 -bottom-2"
      style={`background-color: ${genColor(node.sentBy)};`}
    />

    <AddButton
      data-test={`node-prop-menu-${node.pid}`}
      type="prop"
      class="absolute text-white -bottom-10 right-0 w-8"
      on:click={() => (showPropsAvailable = !showPropsAvailable)}
    />
  </div>

  {#if !isRoot}
    <Handle
      type="source"
      position={Position.Top}
      id={`${node.pid}`}
      on:connect
      on:connectend
      on:connectstart
    />

    <ConfirmButton
      on:confirm={removeNode}
      classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto p-1 rounded"
    >
      <Trash />
    </ConfirmButton>
  {:else}
    <button class="btn btn-xs btn-accent absolute left-0 -top-8"> root </button>
  {/if}

  <Handle
    type="target"
    position={Position.Bottom}
    on:connect
    on:connectend
    on:connectstart
  />

  <Handle
    type="source"
    id={`prop-${node.pid}`}
    isConnectable={false}
    on:connect
    on:connectend
    on:connectstart
    position={Position.Left}
  />

  {#if showPropsAvailable}
    <AddMenu
      on:add={addProp}
      on:click={() => (showPropsAvailable = !showPropsAvailable)}
    />
  {/if}
{/if}

<style>
  :global(.svelte-flow .svelte-flow__handle) {
    background-color: transparent;
    border-radius: 999999px;
    border-width: 2px;
    width: 1.5rem;
    height: 1.5rem;
    padding: 3px;

    &::after {
      content: "";
      display: flex;
      border-radius: 999999px;
      height: 100%;
      width: 100%;
      background-color: white;
    }
  }

  :global(.svelte-flow .svelte-flow__handle-top) {
    top: -1rem;
  }

  :global(.svelte-flow .svelte-flow__handle-bottom) {
    bottom: -1rem;
  }

  :global(.svelte-flow .svelte-flow__edge-path) {
    stroke-width: 4px !important;
  }
  :global(.svelte-flow .svelte-flow__handle-left) {
    left: 0rem;
    width: 1.2rem;
    height: 1.2rem;
    border-style: dashed;
    border-width: 2px;
    padding: 2px;
    border-color: white;
    background-color: transparent;
    border-radius: 999999px;

    &::after {
      content: "";
      display: flex;
      border-radius: 999999px;
      height: 100%;
      width: 100%;
      background-color: white;
    }
  }
  :global(
      .svelte-flow .svelte-flow__edge path,
      .svelte-flow__connectionline path
    ) {
    stroke-width: 2;
  }
</style>