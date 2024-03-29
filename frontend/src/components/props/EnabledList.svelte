<script lang="ts">
  import { params } from "@roxi/routify";
  import { localProps } from "../../lib/stores/localProps";
  import Trash from "../../styles/icons/trash.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";

  $: propsStore = $localProps[$params.storyId] as TPropForm[];
  $: propTypes = ["text", "number", "file", "boolean"];

  interface TAvailableProp {
    name: string;
    value: boolean | number | string | undefined;
    type: string;
  }

  const prop: TAvailableProp = {
    name: "",
    value: undefined,
    type: "text",
  };

  const createProp = () => {
    if (prop.type === "boolean") prop.value = true;

    $localProps[$params.storyId].push(structuredClone(prop));
    $localProps = { ...$localProps };

    prop.name = "";
    prop.value = undefined;
  };

  const remove = (index: number): void => {
    $localProps[$params.storyId].splice(index, 1);
    $localProps = { ...$localProps };
  };

  $: if (!$localProps[$params.storyId]) {
    $localProps[$params.storyId] = [];
  }
</script>

<div class="w-full h-fit gap-4 p-2 flex flex-wrap">
  {#each propsStore as formValue, index}
    <label class="flex w-full gap-2 items-center">
      {formValue.name}

      {#if formValue.type === "boolean"}
        <input
          type="checkbox"
          bind:checked={formValue.value}
          class="toggle toggle-primary ml-auto"
        />
      {:else if formValue.type === "number"}
        <input
          placeholder={formValue.placeholder}
          type="number"
          step="any"
          bind:value={formValue.value}
          class="input w-full input-primary input-sm"
        />
      {:else if formValue.type === "file"}
        <input
          type="file"
          class="file-input file-input-sm file-input-bordered file-input-primary w-full"
        />
      {:else}
        <input
          placeholder={formValue.placeholder}
          bind:value={formValue.value}
          class="input w-full input-primary input-sm"
        />
      {/if}

      <ConfirmButton
        on:confirm={() => remove(index)}
        classes="cursor-pointer w-auto h-auto p-1 rounded"
      >
        <Trash />
      </ConfirmButton>
    </label>
  {/each}
</div>

<form
  on:submit|preventDefault={createProp}
  class="self-end w-auto h-auto mt-2 flex justify-center items-center flex-wrap ring-1 ring-primary p-2 rounded"
>
  <div class="w-full flex justify-between items-center">
    <label class="p-1 w-full flex items-center">
      <input
        data-test="input-prop"
        placeholder="prop name"
        class="input input-primary input-sm w-full"
        bind:value={prop.name}
      />
    </label>

    <button type="submit" data-test="add-prop" class="btn btn-primary"
      >add</button
    >
  </div>

  <div class="w-full h-auto flex flex-wrap gap-4">
    {#each propTypes as type}
      <label class="flex items-center gap-2">
        <input
          data-test={`radio-prop-${type}`}
          bind:group={prop.type}
          value={type}
          type="radio"
          name="radio-2"
          class="radio radio-primary"
        />
        {type}
      </label>
    {/each}
  </div>
</form>
