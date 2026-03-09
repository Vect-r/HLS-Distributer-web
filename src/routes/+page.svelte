<script lang="ts">
  import Card, { Content, PrimaryAction } from '@smui/card';
  import { Title, Subtitle } from '@smui/paper';
  import Snackbar, { Actions, Label } from '@smui/snackbar';
  import Button from '@smui/button';

  let snackbarWithClose: Snackbar;
  let snackbarWithoutClose: Snackbar;
</script>

<svelte:head>
  <title>Home - SuperApp</title>
</svelte:head>

<div class="hero">
  <h1 class="mdc-typography--headline3">Welcome to SuperApp</h1>
  <p class="mdc-typography--body1">Your trusted source for premium Ayurvedic medicines and natural herbs.</p>
</div>

<div class="card-container">
  <Card>
    <PrimaryAction>
      <Content>
        <Title>Organic Ashwagandha</Title>
        <Subtitle>Stress Relief & Vitality</Subtitle>
        <p class="mdc-typography--body2">Pure root extract powder for daily wellness.</p>
      </Content>
    </PrimaryAction>
  </Card>

  <Card>
    <PrimaryAction>
      <Content>
        <Title>Triphala Churna</Title>
        <Subtitle>Digestive Health</Subtitle>
        <p class="mdc-typography--body2">Traditional herbal blend for natural detox.</p>
      </Content>
    </PrimaryAction>
  </Card>
  <Button onclick={() => snackbarWithClose.open()}>
  <br>
  <Label>Open Snackbar With Dismiss</Label>
</Button>
</div>

<style>
  .hero {
    margin-bottom: 2rem;
    text-align: center;
  }
  .card-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
  }
</style>