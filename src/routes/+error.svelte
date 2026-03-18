<script>
  import { page } from '$app/stores';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import Button, { Label, Icon } from '@smui/button';
</script>

<svelte:head>
  <title>Oops! {$page.status} - SuperApp</title>
</svelte:head>

<div class="error-container">
  <Paper elevation={3} class="error-paper">
    <Icon class="material-icons error-icon">explore_off</Icon>
    
    <Title class="error-title">{$page.status}</Title>
    <Subtitle class="error-subtitle">
      {#if $page.status === 404}
        Page Not Found
      {:else}
        Something went wrong
      {/if}
    </Subtitle>
    
    <Content>
      <p class="mdc-typography--body1 text-muted">
        {#if $page.error?.message}
          {$page.error.message}
          
        {:else if $page.status === 404}
          We searched high and low, but we couldn't find the page you're looking for.
          
        {:else}
          An unexpected error occurred.
        {/if}
      </p>
      
      <div class="action-buttons">
        <Button href="/" variant="unelevated" color="primary">
          <Icon class="material-icons">home</Icon>
          <Label>Back to Home</Label>
        </Button>
      </div>
    </Content>
  </Paper>
</div>

<style>
  /* Centers the card perfectly in the remaining viewport space */
  .error-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 60vh; 
    padding: 1rem;
    text-align: center;
  }

  /* Styling the Paper component */
  :global(.error-paper) {
    max-width: 500px;
    width: 100%;
    padding: 3rem 2rem !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Adds a nice branding touch using your primary orange theme color */
    border-top: 6px solid var(--mdc-theme-primary, #ff3e00); 
  }

  :global(.error-icon) {
    font-size: 64px !important;
    width: 64px;
    height: 64px;
    color: var(--mdc-theme-primary, #ff3e00);
    margin-bottom: 1rem;
  }

  :global(.error-title) {
    font-size: 4rem !important;
    line-height: 1 !important;
    margin-bottom: 0.5rem !important;
  }
  
  :global(.error-subtitle) {
    font-size: 1.5rem !important;
    margin-bottom: 1.5rem !important;
  }

  .text-muted {
    color: var(--mdc-theme-text-secondary-on-background, #888);
    margin-bottom: 2rem;
  }

  .action-buttons {
    margin-top: 1.5rem;
  }
</style>