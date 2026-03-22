<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';
	import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
	import Drawer, { Content, Header, Subtitle, Scrim } from '@smui/drawer';
	import List, { Item, Text, Graphic, Separator, Subheader } from '@smui/list';
	import IconButton from '@smui/icon-button';
	import Button, {Icon, Label } from '@smui/button';

	import Menu from '@smui/menu';
	// import List, { Item, Separator, Text } from '@smui/list';
	// import Button, { Label } from '@smui/button';

	let drawerOpen = $state(false);
	let isDark = $state(false);

	let user = $state(null);
	let menuOpen = $state(false);
	let menuAnchor = $state(null);

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

	let active = $state('Home');

	function setActive(value: string) {
		active = value;
		drawerOpen = false;
	}

	function parseJwt(token) {
		try {
			const base64Url = token.split('.')[1];
			const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			const jsonPayload = decodeURIComponent(
				atob(base64)
					.split('')
					.map(function (c) {
						return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
					})
					.join('')
			);
			return JSON.parse(jsonPayload);
		} catch (e) {
			return null;
		}
	}

	// Helper: Converts Unix timestamp (seconds) to a readable local date
	function formatLastLogin(timestamp) {
		if (!timestamp) return 'Never';
		return new Date(timestamp * 1000).toLocaleString();
	}

	// Helper: Clear tokens and redirect
	function handleLogout() {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		user = null;
		menuOpen = false;
		goto('/login');
	}

	$effect(() => {
		if (browser) {
			const token = localStorage.getItem('access_token');
			const currentPath = $page.url.pathname;

			if (!token && currentPath !== '/login') {
				goto('/login');
			} else if (token && currentPath === '/login') {
				goto('/');
			} else if (token) {
				// If we have a token but haven't decoded it yet, do it now
				if (!user) {
					user = parseJwt(token);
				}
			} else {
				user = null; // Ensure user is cleared if no token
			}
		}
	});
</script>

<div class="app-container">
	<Drawer variant="modal" bind:open={drawerOpen}>
		<Header>
			<Title>HLS-Distrib</Title>
		</Header>
		<Content>
			<List>
				{#each navLinks as link}
					<Item
						href={link.href}
						onclick={() => setActive(link.name)}
						activated={active === link.name}
					>
						<Graphic class="material-icons">{link.icon}</Graphic>
						<Text>{link.name}</Text>
					</Item>
				{/each}
				<Separator />
				<Subheader tag="h6">Labels</Subheader>
				<Item
					href="javascript:void(0)"
					onclick={() => setActive('Family')}
					activated={active === 'Family'}
				>
					<Graphic class="material-icons" aria-hidden="true">bookmark</Graphic>
					<Text>Family</Text>
				</Item>
			</List>
		</Content>
		<Separator />
	</Drawer>

	<Scrim />

	<div class="main-content">
		<!-- <TopAppBar variant="static">
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
		</TopAppBar> -->

		<TopAppBar variant="static">
			<Row>
				<Section>
					<IconButton class="material-icons" onclick={() => (drawerOpen = !drawerOpen)}>menu</IconButton>
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
					<IconButton class="material-icons" onclick={toggleTheme}>{isDark ? 'light_mode' : 'dark_mode'}</IconButton>
					

					{#if user}
						<div bind:this={menuAnchor} class="user-menu-wrapper">
							<Button
								onclick={() => (menuOpen = !menuOpen)}
								variant="unelevated"
								class="profile-button"
							>
								<Icon class="material-icons">account_circle</Icon>
								<Label>{user.username}</Label>
							</Button>

							<Menu bind:open={menuOpen} anchorElement={menuAnchor} anchorCorner="BOTTOM_LEFT">
								<List>
									<Item disabled>
										<Text class="menu-detail-text"
											>Last Login: {formatLastLogin(user.last_login)}</Text
										>
									</Item>
									<Item disabled>
										<Text class="menu-detail-text">
											Role: {user.is_superuser ? 'Superuser' : 'Standard User'}
										</Text>
									</Item>

									<Separator />

									<Item onclick={handleLogout}>
										<Icon
											class="material-icons"
											style="margin-right: 12px; color: var(--mdc-theme-error, #cf6679);"
											>logout</Icon
										>
										<Text style="color: var(--mdc-theme-error, #cf6679);">Logout</Text>
									</Item>
								</List>
							</Menu>
						</div>
					{/if}
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
