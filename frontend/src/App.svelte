<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import GlobalError from "./components/popups/GlobalError.svelte";
</script>

<GlobalError />

<Router {routes} />
