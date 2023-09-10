<script lang="ts">
  import { goto } from "@roxi/routify";
  import type { Readable } from "svelte/store";
  import { copy } from "../../lib/functions/copy/copy";
  import ArrowLeft from "../../styles/icons/arrow-left.svelte";
  import Spinner from "../../styles/icons/spinner.svelte";

  export let headerName: string;
  export let onCopy: () => void = undefined;
  export let onSync: () => void = undefined;
  export let onOrganize: () => void = undefined;
  export let isFetching: Readable<boolean> = undefined;
  export let id: string;
  export let floatHeader = false;
  export let onReturn: () => void = undefined;

  const goBack = () => {
    if (onReturn) onReturn();

    if (history.length > 1) {
      $goto("../../..");
      return;
    }
  };
</script>

<header
  class:floatHeader
  class="flex justify-between items-center w-full gap-2 px-2 pb-4"
>
  <button on:click={goBack} data-test="btn-return" class="btn btn-primary">
    <ArrowLeft /> go back</button
  >
  <h1 data-test="story-name">{headerName}</h1>

  <button
    on:click={() => copy(id)}
    class="btn btn-xs gap-2 w-auto text-sm overflow-auto overflow-ellipsis"
  >
    {id}</button
  >

  {#if onOrganize}
    <button
      class="btn btn-primary w-auto"
      data-test="btn-organize-content"
      on:click={onOrganize}>- organize</button
    >
  {/if}

  {#if onCopy}
    <button
      class="btn btn-primary w-auto"
      data-test="btn-copy-content"
      on:click={onCopy}>> copy</button
    >
  {/if}

  {#if onSync}
    <button class="btn btn-primary w-auto" on:click={onSync}
      >{#if $isFetching}
        <Spinner />saving...
      {:else}
        > save
      {/if}</button
    >
  {/if}
</header>

<style>
  .floatHeader {
    width: 90%;
    padding: 0;
    position: absolute;
    z-index: 10;
  }
</style>
