<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let classes = "";
  export let label = "";
  export let dataTest = "";

  const confirm = () => dispatch("confirm");

  let state = false;
  let text = "btn-error";
  let timeout: number;

  const checkConfirmation = () => {
    if (state) {
      text = "btn-error";
      state = false;

      confirm();

      clearTimeout(timeout);
    } else {
      text = "btn-warning";
      state = true;

      timeout = setTimeout(() => {
        text = "btn-error";
        state = false;

        clearTimeout(timeout);
      }, 3000);
    }
  };
</script>

<button
  data-test={$$props["data-test"] || dataTest}
  class={["transition-all", classes, text].join(" ")}
  on:click={checkConfirmation}
  tabindex="-1"
>
  {label}
  <slot />
</button>
