<script>
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
</script>

<svelte:head>
  <title>About Us - SuperApp</title>
</svelte:head>

<div class="about-container">
  <Paper elevation={3} style="padding: 2rem;">
    <Title>Our Mission</Title>
    <Subtitle>Bringing ancient wisdom to modern life</Subtitle>
    <Content>
      <p class="mdc-typography--body1">
        We source the highest quality raw herbs directly from sustainable farms to ensure 
        that every batch of our Ayurvedic medicine is pure, potent, and effective.
      </p>
      <p class="mdc-typography--body1">
        Our team is dedicated to providing natural, holistic remedies to support your overall health and well-being.
      </p>
    </Content>
  </Paper>
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding-top: 2rem;
  }
</style>