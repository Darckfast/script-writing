<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Trash from "../../styles/icons/trash.svelte";
  import AddButton from "../buttons/AddButton.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";

  let files: FileList;

  const dispatch = createEventDispatcher();

  export let formValue: TPropForm;
  export let isRemovable = false;
  export let isAddable = false;

  let checked = false;

  const add = () => dispatch("add", formValue);
  const remove = () => dispatch("remove", formValue);

  $: if (typeof formValue.value === "boolean") {
    formValue.value = checked;
  }
</script>

<span
  class="w-full gap-2 flex items-center justify-between cursor-pointer transition-all hover:text-slate-300"
>
  <slot />

  <span class="flex gap-2 items-center">
    {#if isAddable}
      <AddButton
        class="w-6"
        type="prop"
        on:click={add}
        data-test={`node-prop-add-${formValue.name}`}
      />
    {/if}
    {formValue.name}
  </span>

  {#if formValue.type === "boolean"}
    <input
      data-test={`input-${isAddable ? "local" : "node"}-prop-${formValue.name}`}
      type="checkbox"
      bind:checked
      class="toggle toggle-primary ml-auto"
    />
  {:else if formValue.type === "number"}
    <input
      placeholder={formValue.placeholder}
      data-test={`input-${isAddable ? "local" : "node"}-prop-${formValue.name}`}
      type="number"
      step="any"
      bind:value={formValue.value}
      class="input w-full input-primary input-sm"
    />
  {:else if formValue.type === "file"}
    <!-- <inpuc> -->
    <!--   data-test={`input-${isAddable ? "local" : "node"}-prop-${formValue.name}`} -->
    <!--   type="file" -->
    <!--   bind:files -->
    <!--   on:change={loadImage} -->
    <!--   class="file-input file-input-sm file-input-bordered file-input-primary w-full" -->
    <!-- /> -->
  {:else}
    <input
      placeholder={formValue.placeholder}
      data-test={`input-${isAddable ? "local" : "node"}-prop-${formValue.name}`}
      bind:value={formValue.value}
      class="input w-full input-primary input-sm"
    />
  {/if}

  {#if isRemovable}
    <ConfirmButton
      data-test={`remove-${isAddable ? "local" : "node"}-prop-${
        formValue.name
      }`}
      on:confirm={remove}
      classes="cursor-pointer w-auto h-auto p-1 rounded"
    >
      <Trash />
    </ConfirmButton>
  {/if}
</span>
