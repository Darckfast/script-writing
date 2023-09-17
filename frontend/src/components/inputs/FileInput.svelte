<script lang="ts">
  import { UploadRawFile } from "@/functions/wailsjs/go/syncs/DBXSync";
  import { globalError } from "@/stores/globalError";
  import type { CustomWritable } from "svelvet";

  export let parameterStore: CustomWritable<any>;
  export let baseDir = "";

  let files: FileList | undefined = undefined;

  let value = $parameterStore;

  async function selectFile() {
    const res = await UploadRawFile(baseDir);

    if (res.err) {
      globalError.pushError(res.err);

      return;
    }

    $parameterStore = res.content;
  }
</script>

<div class="flex justify-center items-center gap-2 flex-wrap w-52">
  <button class="btn btn-primary" on:click={selectFile}>Upload image</button>
  <input
    value
    class="input input-sm input-bordered input-primary w-full"
  />
</div>