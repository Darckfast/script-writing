<script lang="ts">
  import { ExportBundle } from "@/functions/wailsjs/go/exporter/Exporter";
  import { url } from "@roxi/routify";
  import { v4 as uuidv4 } from "uuid";
  import NodeButton from "../components/buttons/NodeButton.svelte";
  import {
    documents,
    documentsSync,
    updateLocalDocuments,
  } from "../lib/stores/documents";
  import {
    stories,
    storiesFetching,
    storiesSync,
    updateLocalStories,
  } from "../lib/stores/stories";
  import Spinner from "../styles/icons/spinner.svelte";

  let storyName = "";

  const addDocument = () => {
    if (!storyName) return;

    $documents.push({
      id: uuidv4(),
      name: storyName,
      content: {
        json: {},
      },
    });

    storyName = "";
    $documents = [...$documents];
  };

  const add = () => {
    if (!storyName) return;

    const ifid = uuidv4();

    $stories.push({
      ifid,
      latestPid: 1,
      baseDir: `public/${storyName}`,
      type: "story",
      group: "",
      passages: [
        {
          cleanText: "",
          links: [],
          name: 1,
          pid: 1,
          position: {
            x: 150,
            y: 60,
          },
        },
      ],
      createdWith: import.meta.env.VITE_VERSION,
      storyName,
    });

    storyName = "";
    $stories = [...$stories];
  };

  const removeDoc = (index: number) => {
    $documents.splice(index, 1);
    $documents = [...$documents];
  };

  const remove = (index: number) => {
    $stories.splice(index, 1);
    $stories = [...$stories];
  };

  const bundleStories = async () => {
    await ExportBundle();
  };
</script>

<div class="flex items-center justify-center flex-wrap h-auto w-full gap-4 p-2">
  <div class="w-full flex justify-center gap-2 items-center h-4">
    {#if $storiesFetching}
      <Spinner />
      <span>syncing stories...</span>
    {/if}
  </div>

  <h1 class="text-2xl justify-start w-full">stories</h1>
  <hr class="border-b border-gray-400 w-full" />

  {#each $stories as story, index}
    <NodeButton
      href={$url(`./story/:storyIndex/node`, {
        storyIndex: index,
        storyId: story.ifid,
      })}
      name={story.storyName}
      {index}
      onRemove={() => remove(index)}
      type="story"
    />
  {/each}

  <h1 class="text-2xl justify-start w-full">documents</h1>
  <hr class="border-b border-gray-400 w-full" />

  {#if !$documents.length}
    <span class="text-slate-400" data-test="empty-doc-placeholder"
      >no documents available</span
    >
  {/if}

  {#each $documents as document, index}
    <NodeButton
      href={$url(`./document/:documentIndex`, {
        documentIndex: index,
        documentId: document.id,
      })}
      name={document.name}
      {index}
      onRemove={() => removeDoc(index)}
      type="document"
    />
  {/each}
</div>

<div class="flex self-end justify-center w-full p-2 gap-1 h-auto flex-wrap">
  <div class="w-full flex items-center justify-center flex-wrap gap-2 mb-2">
    <button class="btn btn-primary" data-test="btn-create-story" on:click={add}
      >+ story</button
    >

    <button
      class="btn btn-primary"
      data-test="btn-create-document"
      on:click={addDocument}>+ document</button
    >

    <button
      class="btn btn-primary"
      data-test="btn-export-story"
      on:click={() => bundleStories()}>> generate bundle</button
    >
  <!---->
  <!-- <buttoc> -->
  <!--   data-test="btn-sync-story" -->
  <!--   class="btn btn-primary" -->
  <!--   disabled={!$dbxAuth.getAccessToken()} -->
  <!--   on:click={() => { -->
  <!--     storiesSync(); -->
  <!--     documentsSync(); -->
  <!--   }}>= sync</button -->
  <!-- > -->
  <!---->
  <!-- <button -->
  <!--   data-test="btn-sync-story" -->
  <!--   class="btn btn-primary" -->
  <!--   disabled={!$dbxAuth.getAccessToken()} -->
  <!--   on:click={() => { -->
  <!--     updateLocalStories(); -->
  <!--     updateLocalDocuments(); -->
  <!--   }}>= upd</button -->
  <!-- > -->
    <a href={$url(`./config`)} class="btn btn-primary" data-test="a-config"
      >$ configurations</a
    >
  </div>

  <label class="w-full text-sm">
    <input
      data-test="input-story-name"
      bind:value={storyName}
      class="
      h-20
      w-full
      input input-primary input-lg"
    />
  </label>
</div>