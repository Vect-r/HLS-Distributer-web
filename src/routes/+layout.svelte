<script lang="ts">
  import { onMount } from 'svelte';
  import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
  import Drawer, { Content, Header, Subtitle, Scrim } from '@smui/drawer';
  import List, { Item, Text, Graphic, Separator,Subheader  } from '@smui/list';
  import IconButton from '@smui/icon-button';
  import Button, { Label } from '@smui/button';

  let drawerOpen = $state(false);
  let isDark = $state(false);

  // Sync state with what app.html already decided
  onMount(() => {
    const themeLink = document.getElementById('smui-theme-link');
    isDark = themeLink && themeLink.getAttribute('href') === '/smui-dark.css';
  });

  // Handle manual user toggles
  function toggleTheme() {
    isDark = !isDark;
    
    const themeLink = document.getElementById('smui-theme-link');
    if (themeLink) {
      themeLink.href = isDark ? '/smui-dark.css' : '/smui.css';
    }	
    
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: 'home' },
    { name: 'About', href: '/about', icon: 'info' }
  ];

  let active = $state('Home')


  function setActive(value: string){
	active = value;
	drawerOpen = false;
  }
</script>

<div class="app-container">
	<Drawer variant="modal" bind:open={drawerOpen}>
		<Header>
			<Title>HLS-Distrib</Title>
		</Header>		
		<Content>
			<List>
				{#each navLinks as link}
					<Item href={link.href} onclick={() => setActive(link.name)} activated={active === link.name}>
						<Graphic class="material-icons">{link.icon}</Graphic>
						<Text>{link.name}</Text>
					</Item>
				{/each}
				<Separator />
        		<Subheader tag="h6">Labels</Subheader>
        		<Item href="javascript:void(0)" onclick={() => setActive('Family')} activated={active === 'Family'}>
          			<Graphic class="material-icons" aria-hidden="true">bookmark</Graphic>
          			<Text>Family</Text>
        		</Item>
			</List>
		</Content>
		<Separator/>
	</Drawer>

	<Scrim />

	<div class="main-content">
		<TopAppBar variant="static">
			<Row>
				<Section>
					<IconButton class="material-icons menu-button" onclick={() => (drawerOpen = true)}>
						menu
					</IconButton>
					<Title>SuperApp</Title>
				</Section>

				<Section align="end" toolbar>
					<div class="desktop-nav">
						{#each navLinks as link}
							<Button href={link.href} color="secondary">
								<Label>{link.name}</Label>
							</Button>
						{/each}
					</div>

					<IconButton class="material-icons" onclick={toggleTheme}>
						{isDark ? 'light_mode' : 'dark_mode'}
					</IconButton>
				</Section>
			</Row>
		</TopAppBar>

		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	/* Layout constraints */
	.app-container {
		display: flex;
		height: 100vh;
		flex-direction: column;
	}

	/* Responsive Display Logic */
	.desktop-nav {
		display: flex;
		gap: 10px;
	}

	:global(.menu-button) {
		display: none !important;
	}

	@media (max-width: 720px) {
		.desktop-nav {
			display: none;
		}
		:global(.menu-button) {
			display: inline-flex !important;
		}
	}

	main {
		padding: 1rem;
		flex-grow: 1;
	}
</style>
