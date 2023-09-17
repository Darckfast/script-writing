<script lang="ts">
  import { url } from "@roxi/routify";
  import ArrowLeft from "../../styles/icons/arrow-left.svelte";
  import { Auth, GetAuthURL } from "@/functions/wailsjs/go/syncs/DBXSync";
  import Check from "../../styles/icons/check.svelte";
  import DropboxIcon from "../../styles/icons/dropbox-icon.svelte";
  import {
    BrowserOpenURL,
    ClipboardGetText,
  } from "@/functions/wailsjs/runtime/runtime";
  import Spinner from "../../styles/icons/spinner.svelte";
  import { globalError } from "@/stores/globalError";

  let accessCode: string = "";

  async function pasteCode() {
    accessCode ||= await ClipboardGetText();

    const res = await Auth(accessCode);

    if (res.err) {
      globalError.pushError(res.err);
    }
  }
</script>

<div class="w-full h-full">
  <header class="flex justify-between items-center w-full gap-2 px-2">
    <a href={$url("../../..")} class="btn btn-primary">
      <ArrowLeft /> go back</a
    >
    <h1>Configurations</h1>
  </header>

  <div class="flex flex-wrap flex-col items-center justify-center gap-2">
    <div class="flex gap-2 items-center">
      {#await GetAuthURL()}
        <Spinner />
      {:then dbxUrl}
        <button
          class="btn btn-primary gap-2"
          on:click={() => BrowserOpenURL(dbxUrl)}><DropboxIcon /> oauth</button
        >
      {/await}

      <label class="input-group w-auto">
        <input
          bind:value={accessCode}
          placeholder="paste the token here"
          class="input input-primary"
        />
        <button class="btn btn-primary" on:click={pasteCode}>
          + paste
        </button>
      </label>
    <!-- {#if $dbxAuth.getAccessToken()c>
      <em class="text-green-500">
        <Check />
      </em>

      <span
        >Expires at {Intl.DateTimeFormat("en", {
          dateStyle: "short",
          timeStyle: "short",
          timeZone: "America/Sao_Paulo",
        }).format($dbxAuth.getAccessTokenExpiresAt())}</span
      >
    {/if} -->
    </div>
  </div>
</div>
