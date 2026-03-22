<script>
  import { goto } from '$app/navigation';
  import Paper, { Title, Content } from '@smui/paper';
  import Textfield from '@smui/textfield';
  import Button, { Label, Icon } from '@smui/button';
  import CircularProgress from '@smui/circular-progress';
  import {baseUrl} from '$lib/stores'

  let username = $state('');
  let password = $state('');
  let errorMessage = $state('');
  let isLoading = $state(false);

  async function handleLogin(event) {
    event.preventDefault(); // Prevents the page from reloading
    isLoading = true;
    errorMessage = '';

    try {
      // Send credentials to your Django/JWT backend
      const response = await fetch(`${baseUrl}/api/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Store the JWTs in localStorage
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        
        // 2. Redirect the user to the home/dashboard page
        goto('/');
      } else {
        // Capture specific error from backend (usually 'detail' in DRF)
        errorMessage = data.detail || 'Invalid username or password.';
      }
    } catch (error) {
      errorMessage = 'Network error. Please check your connection.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Login - SuperApp</title>
</svelte:head>

<div class="login-container">
  <Paper elevation={3} class="login-paper">
    <Title class="login-title">Welcome Back</Title>
    <p class="mdc-typography--body2 text-muted">Sign in to access your dashboard.</p>

    <Content>
      <form onsubmit={handleLogin} class="login-form">
        
        <Textfield 
          variant="outlined" 
          bind:value={username} 
          label="Username" 
          required 
          style="width: 100%; margin-bottom: 1rem;"
        />

        <Textfield 
          variant="outlined" 
          type="password" 
          bind:value={password} 
          label="Password" 
          required 
          style="width: 100%; margin-bottom: 1.5rem;"
        />

        {#if errorMessage}
          <div class="error-message">
            <Icon class="material-icons">error_outline</Icon>
            <span>{errorMessage}</span>
          </div>
        {/if}

        <Button variant="unelevated" type="submit" disabled={isLoading} style="width: 100%; height: 48px;">
          {#if isLoading}
            <CircularProgress style="width: 24px; height: 24px;" indeterminate />
          {:else}
            <Label>Sign In</Label>
          {/if}
        </Button>
      </form>
    </Content>
  </Paper>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 1rem;
  }

  :global(.login-paper) {
    width: 100%;
    max-width: 400px;
    padding: 2rem !important;
    border-top: 5px solid var(--mdc-theme-primary, #ff3e00);
  }

  :global(.login-title) {
    text-align: center;
    font-size: 2rem !important;
    margin-bottom: 0.5rem !important;
  }

  .text-muted {
    text-align: center;
    color: var(--mdc-theme-text-secondary-on-background, #888);
    margin-bottom: 2rem;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--mdc-theme-error, #cf6679);
    background-color: rgba(207, 102, 121, 0.1);
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }
</style>