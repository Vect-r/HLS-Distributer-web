<script>
  import Button, { Label } from '@smui/button';
  import IconButton from '@smui/icon-button';
  import { limit } from '$lib/stores';

  // 1. Define props using Svelte 5 runes. 
  // We use $bindable() so the parent can listen to changes on 'offset'.
  let { 
    total, 
    offset = $bindable(0) 
  } = $props();

  // 2. Reactive calculations using $derived
  let totalPages = $derived(Math.ceil(total / limit));
  let currentPage = $derived(Math.floor(offset / limit) + 1);
  let pages = $derived(getPageNumbers(currentPage, totalPages));

  // 3. The math helper stays inside the component
  function getPageNumbers(current, totalPages) {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (current >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', current - 1, current, current + 1, '...', totalPages];
  }
</script>

{#if totalPages > 1}
  <div class="pagination-wrapper">
    <div class="pagination-container">
      
      <IconButton
        class="material-icons"
        disabled={currentPage === 1}
        onclick={() => (offset = 0)}
      >
        first_page
      </IconButton>

      <IconButton
        class="material-icons"
        disabled={currentPage === 1}
        onclick={() => (offset = (currentPage - 2) * limit)}
      >
        chevron_left
      </IconButton>

      {#each pages as page}
        {#if page === '...'}
          <span class="ellipsis">...</span>
        {:else}
          <Button
            variant={currentPage === page ? 'unelevated' : 'default'}
            onclick={() => (offset = (page - 1) * limit)}
            class="page-button"
            style={currentPage === page ? 'pointer-events: none;' : ''}
          >
            <Label>{page}</Label>
          </Button>
        {/if}
      {/each}

      <IconButton
        class="material-icons"
        disabled={currentPage === totalPages}
        onclick={() => (offset = currentPage * limit)}
      >
        chevron_right
      </IconButton>

      <IconButton
        class="material-icons"
        disabled={currentPage === totalPages}
        onclick={() => (offset = (totalPages - 1) * limit)}
      >
        last_page
      </IconButton>

    </div>
  </div>
{/if}

<style>
  .pagination-wrapper {
    display: flex;
    justify-content: center;
    padding: 1.5rem 0;
    width: 100%;
    border-top: 1px solid rgba(128, 128, 128, 0.2);
  }

  .pagination-container {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .ellipsis {
    padding: 0 0.5rem;
    color: var(--mdc-theme-text-secondary-on-background, #888);
    font-weight: bold;
    letter-spacing: 2px;
    user-select: none;
  }

  :global(.page-button) {
    min-width: 40px !important;
    padding: 0 8px !important;
  }
</style>