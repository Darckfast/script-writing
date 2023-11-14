<script lang="ts">
  import { params } from "@roxi/routify";
  import { stories } from "../../lib/stores/stories";

  $: storyIndex = $params.storyIndex;
  const storyConfigs: TPropForm[] = [
    {
      value: "",
      name: "baseDir",
      type: "text",
    },
    {
      value: "",
      name: "type",
      type: "text",
    },
    {
      value: false,
      name: "exportOnBundle",
      type: "boolean",
    },
    {
      value: "",
      name: "group",
      type: "text",
    },
  ];
</script>

<div class="p-2 self-baseline w-full gap-4 flex flex-wrap">
  {#if storyIndex}
    {#each storyConfigs as formValue}
      {#if formValue.type === "text"}
        <label class="flex w-full gap-2 items-center">
          {formValue.name}
          <input
            placeholder={formValue.placeholder}
            data-test={`input-config-story-${formValue.name}`}
            bind:value={$stories[storyIndex][formValue.name]}
            class="input w-full input-primary input-sm"
          />
        </label>
      {:else if formValue.type === "boolean"}
        <label class="flex w-full gap-2 items-center">
          {formValue.name}
          <input
            data-test={$$props["data-test"]}
            type="checkbox"
            bind:checked={$stories[storyIndex][formValue.name]}
            class="toggle toggle-primary ml-auto"
          />
        </label>
      {/if}
    {/each}
  {/if}
</div>