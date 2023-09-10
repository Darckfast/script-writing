<script lang="ts">
  import { params } from "@roxi/routify";

  import { genColor } from "@/functions/colors/colorGen";
  import { getFromPathOrPromise } from "@/functions/images/imagePromise";
  // import { getConnections, props } from "@/functions/nodes.utils/node.utils";
  import { getConnections, props } from "@/functions/node.utils/nodes.utils";
  import { localPropsStore } from "@/stores/localProps";
  import { createEventDispatcher, onMount } from "svelte";
  import { get } from "svelte/store";
  import { Anchor, Node, generateInput, generateOutput } from "svelvet";
  import { stories } from "../../lib/stores/stories";
  import Copy from "../../styles/icons/copy.svelte";
  import LinkSlashSolid from "../../styles/icons/link-slash-solid.svelte";
  import Spinner from "../../styles/icons/spinner.svelte";
  import Trash from "../../styles/icons/trash.svelte";
  import AddButton from "../buttons/AddButton.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";
  import ShowHideButton from "../buttons/ShowHideButton.svelte";
  import TextareaInput from "../inputs/TextareaInput.svelte";
  import PassagePropMenu from "./AddMenu.svelte";

  const dispatch = createEventDispatcher();

  export let node: StoryNode;
  export let isRoot = false;

  let container: HTMLDivElement;
  let canFetch = false;
  let showPropsAvailable = false;
  let imagePrm = null;
  let showProps = false;

  const inputs = generateInput(node);
  const output = generateOutput(inputs, (input) => input);
  const linkInputs = generateInput({});
  const outputLink = generateOutput(inputs, (input) => ({ pid: input.pid }));

  $: node = $output;
  $: ({ storyId } = $params);
  $: localProps = $localPropsStore[storyId];
  $: anchors = props(node, localProps);
  $: linkConnections = getConnections(node);
  $: if (node.baseDir && node.image && canFetch) {
    node.image = getFromPathOrPromise($output.image, node.baseDir);

    imagePrm = node.image.promise;
  }

  onMount(() => {
    let observer = new IntersectionObserver(
      ([entry], self) => {
        if (entry.isIntersecting && node.image) {
          canFetch = true;

          self.unobserve(entry.target);
        }
      },
      {
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.unobserve(container);
  });

  const remove = () => dispatch("remove", { pid: $output.pid });
  const changeRoot = () => dispatch("changeRoot");
  const addNode = () => {
    let { latestPid } = $stories[$params.storyIndex];

    latestPid ||= 0;

    const newNode = {
      pid: latestPid + 1,
      name: 0,
      cleanText: "",
      links: [],
      position: {
        x: $output.position.x,
        y: $output.position.y + 300,
      },
    };

    const links = getOrCreateEmptyLink();

    links.update((state) => {
      return [...state, { pid: newNode.pid }];
    });

    dispatch("addNode", newNode);
  };

  const cloneNode = () => {
    const currentNode = { ...$output };

    if (currentNode.image !== undefined) {
      currentNode.image = {
        ...currentNode.image,
        promise: {},
      };
    }

    const refNode = structuredClone(currentNode);
    let { latestPid } = $stories[$params.storyIndex];

    latestPid ||= 0;

    refNode.pid = latestPid + 1;

    dispatch("cloneNode", refNode);
  };

  const getOrCreateEmptyLink = () => {
    if ($inputs.links === undefined) {
      const newInputLink = generateInput({ value: [] });
      $inputs.links = get(newInputLink).value;
    }

    return $inputs.links;
  };

  const removeProp = ({ detail }) => {
    const { inputKey } = detail.anchor;

    if (!inputKey) return;

    inputs.update((state) => {
      delete state[inputKey];

      return state;
    });
  };

  const addProp = ({ detail: { name, value, type } }) => {
    if (name in $inputs) {
      console.log("key already exists", $inputs, name);
      return;
    }

    const propInput = generateInput({});

    propInput.set(value);

    inputs.update((state) => {
      state[name] = propInput;

      return state;
    });
  };

  const onLink = ({ detail: { anchor }, type }: TOnLink) => {
    const links = getOrCreateEmptyLink();

    if (type === "connection") {
      links.update((state) => {
        const pidLink = get<TLink>(get<TLinkCustom>(anchor.store).link);

        if (state.find((link) => link.pid === pidLink.pid)) return state;

        return [...state, pidLink];
      });

      return;
    }

    if (type === "disconnection") {
      links.update((state) => {
        const { pid } = get<TLink>(get<TLinkCustom>(anchor.store).link);
        return state.filter((link) => link.pid !== pid);
      });
    }
  };

  const removeAndDestroy = (destroy) => {
    if (isRoot) return;

    remove();
    destroy();
  };
</script>

{#if node}
  <div bind:this={container}>
    <Node
      id={`node-${$output.pid}`}
      bind:position={node.position}
      let:destroy
      let:disconnect
    >
      <div
        class="btn btn-primary no-animation flex-col p-2 relative h-fit w-80 border-transparent border-2 shadow"
      >
        <TextareaInput
          data-test={`node-input-${node.pid}`}
          parameterStore={$inputs.cleanText}
        />

        {#if node.image}
          {#await imagePrm}
            <div class="flex h-96">
              <Spinner />
            </div>
          {:then src}
            <img
              {src}
              alt="message"
              style="width: 20rem;"
              loading="lazy"
              data-lazy-load
            />
          {:catch}
            <img
              src="/unicorn.svg"
              alt="error"
              style="width: 100%;"
              loading="lazy"
              data-lazy-load
            />
          {/await}
        {/if}
        <span
          class="w-5 h-5 bg-white absolute rounded-full -left-2 -bottom-2"
          style={`background-color: ${genColor($output.sentBy)};`}
        />

        <ShowHideButton
          bind:show={showProps}
          class="w-4 absolute -bottom-7 left-5 hover:scale-105 transition-all"
        />

        <button
          on:click={cloneNode}
          class="w-8 bg-cyan-400 rounded hover:scale-105 p-1 transition-all absolute right-0 -top-16"
        >
          <Copy class="w-6" />
        </button>

        <AddButton
          data-test={`node-add-${node.pid}`}
          class="absolute -right-16 bottom-0 w-8"
          on:click={addNode}
        />
        <AddButton
          data-test={`node-prop-menu-${node.pid}`}
          type="prop"
          class="absolute -bottom-16 right-0 w-8"
          on:click={() => (showPropsAvailable = !showPropsAvailable)}
        />
      </div>

      {#if !isRoot}
        <div class="absolute flex -top-5 right-1/2 z-0">
          <Anchor
            id={`link-out-${$output.pid}`}
            output
            direction="north"
            outputStore={outputLink}
          />
        </div>

        <ConfirmButton
          on:click={(e) => e.stopPropagation()}
          on:confirm={() => removeAndDestroy(destroy)}
          classes="cursor-pointer absolute -top-2 -right-2 w-auto h-auto p-1 rounded"
        >
          <Trash />
        </ConfirmButton>

        <button
          class="btn btn-xs absolute left-0 -top-8 btn-secondary"
          on:click={changeRoot}>make root</button
        >
      {:else}
        <button class="btn btn-xs btn-accent absolute left-0 -top-8">
          root
        </button>
      {/if}

      <div
        class="absolute flex justify-center items-center -bottom-8 right-1/2 gap-2 z-0"
      >
        <button
          data-test={`node-unlink-${node.pid}`}
          class="btn btn-square btn-outline btn-accent btn-xs"
          on:click={() => linkConnections.forEach(disconnect)}
        >
          <LinkSlashSolid class="w-4" />
        </button>
        <Anchor
          id={`link-${$output.pid}`}
          input
          inputsStore={linkInputs}
          direction="south"
          nodeConnect
          multiple
          bind:connections={linkConnections}
          on:connection={onLink}
          on:disconnection={onLink}
          key="link"
        />
      </div>

      {#if showProps}
        <div class="flex flex-col absolute -left-4 top-0 gap-2 z-0">
          {#each anchors as { name: key } (key)}
            <Anchor
              id={key}
              input
              inputsStore={inputs}
              {key}
              on:disconnection={removeProp}
            />
          {/each}
        </div>
      {/if}

      {#if showPropsAvailable}
        <PassagePropMenu
          on:click={() => (showPropsAvailable = !showPropsAvailable)}
          on:add={addProp}
        />
      {/if}
    </Node>
  </div>

  <slot {showProps} />
{/if}
