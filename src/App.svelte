<script>
  import Router from "./utils/Router.svelte";
  import { onMount } from "svelte";
  import { navigationStore } from "./stores/NavigationStore";
  import Navbar from "./components/Navbar.svelte";
  import FloatingTicketButton from "./components/FloatingTicketButton.svelte";

  onMount(() => {
    document.title = "QiCinema";
  });
</script>

<main>
  {#if $navigationStore.page !== "/auth"}
    <Navbar />
    <FloatingTicketButton />
  {/if}
  <Router />
</main>
