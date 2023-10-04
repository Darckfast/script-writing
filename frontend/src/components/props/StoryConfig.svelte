<script lang="ts">
  import { params } from "@roxi/routify";
  import { stories } from "../../lib/stores/stories";
  import { findStory } from "../../lib/stores/story";

  const openStory = $stories.find(findStory($params.storyId));

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

  $: {
    console.log(openStory);

    for (let index = 0; index < $stories.length; index++) {
      const story = $stories[index];

      if (story.ifid === openStory?.ifid) {
        $stories[index] = openStory;
      }
    }
  }
</script>

<div class="p-2 self-baseline w-full gap-4 flex flex-wrap">
  {#if openStory}
    {#each storyConfigs as formValue}
      {#if formValue.type === "text"}
        <label class="flex w-full gap-2 items-center">
          {formValue.name}
          <input
            placeholder={formValue.placeholder}
            data-test={`input-config-story-${formValue.name}`}
            bind:value={openStory[formValue.name]}
            class="input w-full input-primary input-sm"
          />
        </label>
      {:else if formValue.type === "boolean"}
        <label class="flex w-full gap-2 items-center">
          {formValue.name}
          <input
            data-test={$$props["data-test"]}
            type="checkbox"
            bind:checked={openStory[formValue.name]}
            class="toggle toggle-primary ml-auto"
          />
        </label>
      {/if}
    {/each}
  {/if}
</div>
