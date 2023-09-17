<script lang="ts">
  import { stories } from "@/stores/stories";
  import { params } from "@roxi/routify";
  import { Anchor, Node, generateInput, generateOutput } from "svelvet";
  import Trash from "../../styles/icons/trash.svelte";
  import ConfirmButton from "../buttons/ConfirmButton.svelte";
  import PropInput from "../inputs/PropInput.svelte";

  export let prop: TProp;
  export let onRemove: (key: string) => any;

  $: story = $stories.find((story) => story.ifid === $params.storyId);

  const inputs = generateInput(prop);
  const output = generateOutput(inputs, (input) => input.value);

  $: ({ position, pid, name, id, type, value } = $inputs);
</script>

<Node id={$id} bind:position={$position} let:destroy>
  <span
    class="w-full gap-2 flex items-center justify-start cursor-pointer transition-all hover:text-slate-300"
  >
    <slot />
    <span class="flex gap-2 items-center">
      {$name}
    </span>

    <PropInput
      parameterStore={value}
      type={$type}
      baseDir={story?.baseDir}
      data-test={`node-prop-${prop.pid}-${prop.name}`}
    />

    <ConfirmButton
      data-test={`node-prop-remove-${$pid}-${$name}`}
      on:confirm={() => {
        onRemove($name);
        destroy();
      }}
      classes="cursor-pointer w-auto h-auto p-1 rounded"
    >
      <Trash />
    </ConfirmButton>

    <Anchor
      output
      outputStore={output}
      connections={[[`node-${$pid}`, $name]]}
    />
  </span>
</Node>
