<script lang="ts">
  import { stories } from "@/stores/stories";
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  import Trash from "../../styles/icons/trash.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";

  type $$Props = NodeProps;

  export let data: {
    propName: string;
    passagePid: number;
    storyIndex: number;
    index: number;
  };

  function removeProp() {
    delete $stories[data.storyIndex].passages[data.index][data.propName];

    const removeEvent = new Event("updateedges");
    document.dispatchEvent(removeEvent);
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
      <input
        class="input input-bordered input-sm input-primary"
        bind:value={$stories[data.storyIndex].passages[data.index][
          data.propName
        ]}
      />
    </label>
    <ConfirmButton
      on:confirm={removeProp}
      classes="cursor-pointer  w-auto h-auto p-1 rounded"
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