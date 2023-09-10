<script lang="ts">
  import type { CustomWritable } from "svelvet";
  import { getImagePromise } from "../../lib/functions/images/imagePromise";

  export let parameterStore: CustomWritable<any>;
  export let baseDir = "";

  let files: FileList = null;

  let value = $parameterStore?.value;

  const loadImage = () => {
    if (files.length === 0) return;

    $parameterStore = getImagePromise({
      baseDir,
      file: files[0],
    });
  };
</script>

<div class="flex justify-center items-center gap-2 flex-wrap w-52">
  <input
    data-test={$$props["data-test"]}
    type="file"
    bind:files
    on:change={loadImage}
    class="file-input file-input-sm file-input-bordered file-input-primary w-full"
  />

  <input
    on:change={() => {
      $parameterStore = value;
    }}
    bind:value
    class="input input-sm input-bordered input-primary w-full"
  />
</div>
