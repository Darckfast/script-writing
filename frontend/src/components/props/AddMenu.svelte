<script lang="ts">
  import { params } from "@roxi/routify";
  import { localProps } from "../../lib/stores/localProps";
  import FormField from "./FormField.svelte";

  $: passageProps = ($localProps[$params.storyId] ?? []) as TPropForm[];
</script>

<div
  class="absolute -bottom-40 rounded backdrop-blur-3xl text-white p-2 left-0 flex flex-wrap gap-2 w-full z-20"
>
  <button
    data-test="node-prop-menu-close"
    on:click
    class="btn btn-error btn-sm btn-outline w-full"
  >
    close
  </button>

  {#if passageProps.length === 0}
    <p class="text-slate-300">No props found</p>
  {/if}

  {#each passageProps as formValue}
    <FormField {formValue} isAddable on:add />
  {/each}
</div>
