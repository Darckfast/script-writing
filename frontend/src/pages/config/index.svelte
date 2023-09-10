<script lang="ts">
  import { url } from "@roxi/routify";
  import ArrowLeft from "../../styles/icons/arrow-left.svelte";

  import { dbxAuth, isFetching } from "../../lib/stores/dbx";
  import Check from "../../styles/icons/check.svelte";
  import DropboxIcon from "../../styles/icons/dropbox-icon.svelte";

  import { save } from "@/functions/loadSave/loadSave";
  import {
    BrowserOpenURL,
    ClipboardGetText,
  } from "@/functions/wailsjs/runtime/runtime";
  import dayjs from "dayjs";
  import { globalError } from "../../lib/stores/globalError";
  import Spinner from "../../styles/icons/spinner.svelte";

  let accessCode = "";

  const dbxAuthUrl = $dbxAuth
    .getAuthenticationUrl(
      undefined,
      undefined,
      "code",
      "offline",
      undefined,
      undefined,
      true
    )
    .then((authUrl) => {
      localStorage.setItem("codeVerifier", $dbxAuth.getCodeVerifier());

      return authUrl.toString();
    })
    .catch((err) => {
      globalError.pushError(err);

      return "";
    });

  const pasteCode = async () => {
    $isFetching = true;
    accessCode = await ClipboardGetText();

    $dbxAuth.setCodeVerifier(localStorage.getItem("codeVerifier"));
    $dbxAuth
      .getAccessTokenFromCode(undefined, accessCode)
      .then(({ result: { access_token, refresh_token, expires_in } }: any) => {
        save({
          key: "dbx-access-token",
          value: {
            access_token,
            refresh_token,
            expires_in: dayjs().add(expires_in, "second").unix(),
          },
        });

        $dbxAuth.setAccessToken(access_token);
        $dbxAuth.setRefreshToken(refresh_token);
        $dbxAuth.setAccessTokenExpiresAt(
          dayjs().add(expires_in, "second").toDate()
        );
      })
      .catch((err) => globalError.pushError(err))
      .finally(() => {
        $isFetching = false;
      });
  };
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
      {#await dbxAuthUrl}
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
        <button class="btn btn-primary" on:click={pasteCode}
          >{#if $isFetching}
            <Spinner />
          {:else}
            + paste
          {/if}</button
        >
      </label>
      {#if $dbxAuth.getAccessToken()}
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
      {/if}
    </div>
  </div>
</div>
