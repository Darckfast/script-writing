<script lang="ts">
  import EnabledList from "./EnabledList.svelte";
  import StoryConfig from "./StoryConfig.svelte";

  let tab = "list";
</script>

<div class="h-full flex flex-wrap">
  <div class="w-full tabs self-start">
    <button
      class="tab tab-lifted"
      class:tab-active={tab === "list"}
      on:click={() => (tab = "list")}>Props</button
    >
    <button
      class="tab tab-lifted"
      class:tab-active={tab === "config"}
      on:click={() => (tab = "config")}>Configs</button
    >
  </div>

  {#if tab === "list"}
    <EnabledList />
  {:else}
    <StoryConfig />
  {/if}
</div>
