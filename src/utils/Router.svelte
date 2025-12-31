<script>
    import {routes} from '../routes';
    import {navigationStore} from '../stores/NavigationStore';

  const currentRoute = $derived(routes.find(route => route.path === $navigationStore.page));
</script>

<main>
  {#if currentRoute}
    <currentRoute.component />
  {:else}
    <p>404 - Page not found: {$navigationStore.page}</p>
    <p>Available routes: {routes.map(r => r.path).join(', ')}</p>
  {/if}
</main>