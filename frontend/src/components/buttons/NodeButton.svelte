<script lang="ts">
  import { goto } from "@roxi/routify";
  import Trash from "../../styles/icons/trash.svelte";
  import ConfirmButton from "./ConfirmButton.svelte";

  export let onRemove: () => void;
  export let index: number;
  export let name: string;
  export let type: "story" | "document";
  export let href;

  const navigate = async (e: MouseEvent) => {
    $goto(href);
  };
</script>

<div class="relative">
  <button
    data-test={`a-${type}-node-${index}`}
    on:mousedown={navigate}
    on:click={navigate}
    class="gap-2 btn btn-primary relative no-animation"
  >
    {name}
  </button>

  <ConfirmButton
    dataTest={`btn-delete-${type}`}
    on:click={(e) => e.stopImmediatePropagation()}
    on:confirm={onRemove}
    classes="cursor-pointer w-auto h-auto p-1 rounded absolute -left-2 -top-2"
  >
    <Trash />
  </ConfirmButton>
</div>
