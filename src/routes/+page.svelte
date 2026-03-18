<script lang="ts">
	// import Card, { Content, PrimaryAction } from '@smui/card';
	// import { Title, Subtitle } from '@smui/paper';
	// import Snackbar, { Actions, Label } from '@smui/snackbar';
	// import Button from '@smui/button';

	// let snackbarWithClose: Snackbar;
	// let snackbarWithoutClose: Snackbar;
	import Button, { Label, Icon } from '@smui/button';
	// import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import CircularProgress from '@smui/circular-progress';
	import ChipInput from '@smui-extra/chip-input';
	import Select, { Option } from '@smui/select';

	import Paper from '@smui/paper';
	import Fab from '@smui/fab';
	import IconButton from '@smui/icon-button';

	import { buildQuery, formatDate } from '$lib/utils.js';
	import { sortOptions } from '$lib/stores';

	let { data } = $props();
	let { item_values } = data;

	// let searchQuery = $state('');
	let filterDialogOpen = $state(false);
	let downloadDialogOpen = $state(false);

	let value = $state('');
	let apiParams = $state(data.apiParams);

	let tags = $state([]);
	let models = $state([]);
	let sites = $state([]);

	const tagList = item_values.tags;
	const modelList = item_values.performers;
	const siteList = item_values.networks;

	const sort = $state(apiParams.sort);

	function doSearch() {
		alert('Search for ' + value);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			doSearch();
		}
	}

	async function fetchVideosAll() {
		const query = buildQuery(apiParams);
		const url = `http://127.0.0.1:8000/api/videos/?${query}`;
		const res = await fetch(url);
		if (res.ok) {
			return await res.json();
		} else {
			throw new Error('Failed to fetch data');
		}
	}

	function reset() {
		apiParams.network = [];
		apiParams.performer = [];
		apiParams.tag = [];
		apiParams.search = '';
		apiParams.ordering = '-created_at';
		apiParams.page = 1;
	}

	$effect(() => {
		apiParams.tag = tags;
		apiParams.performer = models;
	});
</script>

<svelte:head>
	<title>Home - SuperApp</title>
</svelte:head>

<div class="dashboard-container">
	{#if item_values}
		<div class="controls-container">
			<div class="action-bar">
				<div class="search-wrapper">
					<Paper class="solo-search-paper" elevation={1}>
						<Icon class="material-icons search-icon">search</Icon>
						<input
							type="text"
							bind:value={apiParams.search}
							placeholder="Search"
							class="solo-input"
						/>

						{#if apiParams.search.length > 0}
							<IconButton
								class="material-icons clear-button"
								onclick={() => (apiParams.search = '')}
								aria-label="Clear search"
							>
								close
							</IconButton>
						{/if}
					</Paper>

					<Fab color="primary" mini class="search-fab">
						<Icon class="material-icons">arrow_forward</Icon>
					</Fab>
					<Fab color="primary" mini onclick={() => (downloadDialogOpen = true)}>
						<Icon class="material-icons">download</Icon>
					</Fab>
				</div>

				<Button variant="unelevated" onclick={() => (filterDialogOpen = true)}>
					<Icon class="material-icons">filter_list</Icon>
					<Label>Filter</Label>
				</Button>

				<Button variant="outlined" onclick={reset}>
					<Icon class="material-icons">refresh</Icon>
					<Label>Reset</Label>
				</Button>

			</div>

			<div class="sort-bar">
				<Select
					variant="outlined"
					bind:value={apiParams.ordering}
					label="Sort By"
					style="width: 100%; max-width: 350px;"
				>
					{#each Object.entries(sortOptions) as [key, value] (key)}
						<Option value={key}>{value}</Option>
					{/each}
				</Select>
			</div>
		</div>
	{/if}
	{#await fetchVideosAll()}
		<CircularProgress style="height: 32px; width: 32px;" indeterminate />
	{:then videos}
		<pre>{JSON.stringify(apiParams)}</pre>
		<div class="table-container">
			<DataTable style="width: 100%;">
				<Head>
					<Row>
						<Cell>Title</Cell>
						<Cell>URL</Cell>
						<Cell>Network</Cell>
						<Cell>Models Count</Cell>
						<Cell>Tags Count</Cell>
						<Cell>Created At</Cell>
					</Row>
				</Head>
				<Body>
					{#each videos.results as row (row.id)}
						<Row>
							<Cell>{row.title}</Cell>
							<Cell>{row.url}</Cell>
							<Cell>{row.network_name}</Cell>
							<Cell>{row.performer_names.length}</Cell>
							<Cell>{row.tag_names.length}</Cell>
							<Cell>{formatDate(row.created_at)}</Cell>
						</Row>
					{/each}
				</Body>
			</DataTable>
		</div>
	{:catch error}
		<p>{error}</p>
	{/await}
</div>

<Dialog bind:open={filterDialogOpen} aria-labelledby="filter-title" class="responsive-dialog">
	<Title id="filter-title">Filter Content</Title>
	<Content id="filter-content">
		<div class="filter-form">
			<ChipInput
				bind:chips={tags}
				bind:value
				chipTrailingAction$class="material-icons"
				chipTrailingAction$aria-label="Remove category"
				autocomplete$options={tagList.filter((category) => !tags.find((cat) => cat === category))}
				autocomplete$showMenuWithNoInput
			>
				{#snippet chipTrailingAction()}cancel{/snippet}
				{#snippet label()}Tags{/snippet}
			</ChipInput>
			<ChipInput
				bind:chips={models}
				bind:value
				chipTrailingAction$class="material-icons"
				chipTrailingAction$aria-label="Remove category"
				autocomplete$options={modelList.filter(
					(category) => !models.find((cat) => cat === category)
				)}
				autocomplete$showMenuWithNoInput
			>
				{#snippet chipTrailingAction()}cancel{/snippet}
				{#snippet label()}Models{/snippet}
			</ChipInput>
			<ChipInput
				bind:chips={sites}
				bind:value
				chipTrailingAction$class="material-icons"
				chipTrailingAction$aria-label="Remove category"
				autocomplete$options={siteList.filter((category) => !sites.find((cat) => cat === category))}
				autocomplete$showMenuWithNoInput
			>
				{#snippet chipTrailingAction()}cancel{/snippet}
				{#snippet label()}Sites{/snippet}
			</ChipInput>
		</div>
	</Content>
</Dialog>

<!-- <Dialog
	bind:open={filterDialogOpen}
	fullscreen
	aria-labelledby="filter-title"
	aria-describedby="fullscreen-content"
>
	<Header>
		<Title id="fullscreen-title">Terms and Conditions</Title>
	</Header>
	<Content id="fullscreen-content">
		<ChipInput
			bind:chips={tags}
			bind:value
			chipTrailingAction$class="material-icons"
			chipTrailingAction$aria-label="Remove category"
			autocomplete$options={tagList.filter((category) => !tags.find((cat) => cat === category))}
			autocomplete$showMenuWithNoInput
		>
			{#snippet chipTrailingAction()}cancel{/snippet}
			{#snippet label()}
				tags
			{/snippet}
		</ChipInput>
	</Content>
	<Actions>
		<Button action="reject">
			<Label>Reject</Label>
		</Button>
		<Button action="accept" defaultAction>
			<Label>Accept</Label>
		</Button>
	</Actions>
</Dialog> -->

<Dialog bind:open={downloadDialogOpen} aria-labelledby="download-title">
	<Title id="download-title">Download Data</Title>
	<Content>
		<p>Are you sure you want to export the current table view as a CSV file?</p>
	</Content>
	<Actions>
		<Button onclick={() => (downloadDialogOpen = false)}>
			<Label>Cancel</Label>
		</Button>
		<Button onclick={() => (downloadDialogOpen = false)} variant="unelevated">
			<Label>Confirm Download</Label>
		</Button>
	</Actions>
</Dialog>

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

	/* --- NEW Wrapper Styles --- */
	.search-wrapper {
		display: flex;
		align-items: center;
		gap: 0.5rem; /* Space between search and FAB */
		width: 100%;
		max-width: 700px; /* Keeps it from getting too wide on desktop */
	}

	:global(.responsive-dialog .mdc-dialog__surface) {
		width: 90vw !important; /* Takes up 90% of the screen width on mobile */
		max-width: 800px !important; /* Stops growing at 800px on desktop monitors */
		min-height: 50vh; /* Guarantees the dialog is at least half the screen height */
		max-height: 90vh; /* Prevents the dialog from overflowing the screen */
	}

	/* Make sure the form inside stretches to use the new space */
	.filter-form {
		display: flex;
		flex-direction: column;
		padding-top: 1rem;
		min-height: 300px; /* Gives the ChipInput dropdown menu plenty of room to open */
	}

	/* --- UPDATED Solo Search Styles --- */
	:global(.solo-search-paper) {
		display: flex;
		align-items: center;
		flex-grow: 1; /* Tells the search bar to take up remaining space next to the FAB */
		height: 48px;
		padding: 0 16px;
		/* Removed: width: 100% and margin-right */
	}

	:global(.search-icon) {
		margin-right: 12px;
		color: var(--mdc-theme-text-secondary-on-background, #888);
	}

	.solo-input {
		border: none;
		background: transparent;
		outline: none;
		flex-grow: 1;
		font-family: inherit;
		font-size: 1rem;
		color: inherit;
		width: 100%; /* Ensures the input stretches inside the Paper */
	}

	/* Keep this as it is */
	/* --- NEW: Controls Container --- */
	.controls-container {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Space between the top row and the Select dropdown */
		margin-bottom: 2rem;
		align-items: center;
	}

	/* Your existing action bar, untouched */
	.action-bar {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		width: 100%;
	}

	/* --- NEW: Sort Bar --- */
	.sort-bar {
		display: flex;
		width: 100%;
		/* justify-content: flex-start;  <-- Uncomment this if you want it aligned strictly to the left edge of the search bar instead of centered */
		justify-content: center;
	}

	/* Keep your existing .search-wrapper and .solo-search-paper styles here */

	:global(.clear-button) {
		margin-left: 4px;
		margin-right: -8px; /* Pulls the icon slightly closer to the right edge */
		color: var(--mdc-theme-text-secondary-on-background, #888) !important;
		padding: 8px !important; /* Reduces the touch target size slightly to fit the Paper height */
	}
</style>
