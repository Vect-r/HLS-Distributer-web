<script>
  import Button, { Label } from '@smui/button';
  let count = $state(0); // Using Svelte 5 runes
</script>

<div class="container">
  <Button variant="raised" onclick={() => count++}>
    <Label>Clicked {count} times</Label>
  </Button>
</div>

<style>
  .container {
    padding: 2rem;
  }
</style>