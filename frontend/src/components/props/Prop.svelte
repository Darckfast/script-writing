<script lang="ts">
  import { localProps } from "@/stores/localProps";
  import { stories } from "@/stores/stories";
  import { params } from "@roxi/routify";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import { onMount } from "svelte";
  import PlusSolid from "../../styles/icons/plus-solid.svelte";
  import Trash from "../../styles/icons/trash.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";

  type $$Props = NodeProps;

  export let data: {
    propName: string;
    passagePid: number;
    storyIndex: number;
    index: number;
  };

  let propType: string | undefined;

  onMount(() => {
    const local: TPropForm[] = $localProps[$params.storyId];

    if (local) {
      for (let i = 0; i < local.length; i++) {
        const prop = local[i];

        if (prop.name === data.propName) {
          propType = prop.type;
        }
      }
    }
  });

  function removeProp() {
    delete $stories[data.storyIndex].passages[data.index][data.propName];

    const removeEvent = new Event("updateedges");
    document.dispatchEvent(removeEvent);
  }

  function addEntryToProp() {
    $stories[data.storyIndex].passages[data.index][data.propName].push("");
    $stories[data.storyIndex].passages[data.index][data.propName] =
      $stories[data.storyIndex].passages[data.index][data.propName];
  }

  function removeEntryFromProp(index: number) {
    $stories[data.storyIndex].passages[data.index][data.propName].splice(
      index,
      1
    );
    $stories[data.storyIndex].passages[data.index][data.propName] =
      $stories[data.storyIndex].passages[data.index][data.propName];
  }
</script>

{#if $stories[data.storyIndex].passages[data.index]}
  <div class="p-2 flex text-white items-center gap-2">
    <Handle
      type="target"
      id={`prop-${data.propName}-${data.passagePid}`}
      position={Position.Right}
    />

    <label>
      {data.propName}
      {#if propType === "list"}
        <div class="flex flex-col gap-2">
          {#each $stories[data.storyIndex].passages[data.index][data.propName] as value, index}
            <div class="flex justify-center items-center">
              <input
                class="input input-bordered input-sm input-primary"
                bind:value
              />
            </div>
          {/each}
          <button class="w-4 place-self-end" on:click={addEntryToProp}
            ><PlusSolid /></button
          >
        </div>
      {:else}
        <input
          class="input input-bordered input-sm input-primary"
          bind:value={$stories[data.storyIndex].passages[data.index][
            data.propName
          ]}
        />
      {/if}
    </label>
    <ConfirmButton
      on:confirm={removeProp}
      classes="cursor-pointer w-auto h-auto p-1 rounded"
    >
      <Trash />
    </ConfirmButton>
  </div>
{/if}

<style>
  :global(.svelte-flow .svelte-flow__handle-right) {
    right: -0.25rem;
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
</style>
