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
	import Badge from '@smui-extra/badge';
	
	import Pagination from '$lib/components/Pagination.svelte';

	import { buildQuery, formatDate } from '$lib/utils.js';
	import { sortOptions, baseUrl } from '$lib/stores';
	import { authFetch } from '$lib/api';

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

	const qualities = item_values.qualities;
	let quality = $state('');

	const codecs = item_values.codecs;
	let codec = $state('');

	// console.log('HLS Download: ',quality,codec)
	console.log('HLS Download: ', !quality || !codec);

	let downloadLink = $state('');

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
		const url = `/api/videos/?${query}`;
		const res = await authFetch(url);
		if (res.ok) {
			return await res.json();
		} else {
			throw new Error('Failed to fetch data');
		}
	}

	function reset() {
		// apiParams.network = [];
		// apiParams.performer = [];
		// apiParams.tag = [];
		sites = [];
		models = [];
		tags = [];

		apiParams.search = '';
		apiParams.ordering = '-created_at';
		apiParams.offset = 0;
	}

	$effect(() => {
		apiParams.tag = tags;
		apiParams.performer = models;
		apiParams.network = sites;
	});

	function toggleSort(columnName) {
		if (apiParams.ordering === columnName) {
			// If currently ascending, switch to descending
			apiParams.ordering = `-${columnName}`;
		} else if (apiParams.ordering === `-${columnName}`) {
			// If currently descending, clear the sort (reset)
			apiParams.ordering = '-created_at';
		} else {
			// Otherwise, set to ascending
			apiParams.ordering = columnName;
		}
	}

	function downloadHLS() {
		const ObjQuery = Object.assign({}, apiParams, {
			download: true,
			quality: quality,
			codec: codec
		});
		const query = buildQuery(ObjQuery);
		const url = `${baseUrl}/api/videos/?${query}`;
		// return url;
		window.open(url, '_blank');
		downloadDialogOpen = false;
	}
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
	<div class="table-container">
		{#await fetchVideosAll()}
			<CircularProgress style="height: 32px; width: 32px;" indeterminate />
		{:then videos}
			<!-- <pre>DEBUG apiParams: {JSON.stringify(apiParams)}</pre> -->
			<!-- <h1>
			VR Videos
			<Badge aria-label="unread count">{videos.count}</Badge>
		</h1> -->
			<div class="table-header">
				<div class="title-wrapper">
					<h1 class="table-title">Videos</h1>
					<Badge color="primary" position="middle" align="top-end">
						{videos.total}
					</Badge>
				</div>
			</div>
			{#snippet sortIcon(col)}
				{#if apiParams.ordering === col}
					<Icon class="material-icons sort-indicator">arrow_upward</Icon>
				{:else if apiParams.ordering === `-${col}`}
					<Icon class="material-icons sort-indicator">arrow_downward</Icon>
				{:else}
					<Icon class="material-icons sort-indicator placeholder">arrow_upward</Icon>
				{/if}
			{/snippet}
			<DataTable style="width: 100%;">
				<Head>
					<Row>
						<Cell class="sortable-header" onclick={() => toggleSort('title')}>
							<div class="header-content">
								Title
								{@render sortIcon('title')}
							</div>
						</Cell>
						<Cell>URL</Cell>
						<!-- <Cell>Network</Cell> -->
						<Cell class="sortable-header" onclick={() => toggleSort('network__name')}>
							<div class="header-content">
								Network
								{@render sortIcon('network__name')}
							</div>
						</Cell>
						<Cell>Models Count</Cell>
						<Cell>Tags Count</Cell>
						<!-- <Cell>Created At</Cell> -->
						<Cell class="sortable-header" onclick={() => toggleSort('created_at')}>
							<div class="header-content">
								Date Added
								{@render sortIcon('created_at')}
							</div>
						</Cell>
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
					{:else}
						<Row>
							<Cell colspan={6} class="empty-table-message">
								<div class="empty-content">
									<span class="material-icons">search_off</span>
									<p>No videos found matching your search or filters.</p>
								</div>
							</Cell>
						</Row>
					{/each}
				</Body>
			</DataTable>
			<Pagination total={videos.total} bind:offset={apiParams.offset} />
		{:catch error}
			<p>{error}</p>
		{/await}
	</div>
</div>

<Dialog
	bind:open={filterDialogOpen}
	aria-labelledby="filter-title"
	class="responsive-dialog overflow-visible-dialog"
>
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

<Dialog
	bind:open={downloadDialogOpen}
	aria-labelledby="download-title"
	class="overflow-visible-dialog"
>
	<Title id="download-title">Download Options</Title>
	<Content>
		<div class="download-form">
			<p class="mdc-typography--body2 text-muted" style="margin-bottom: 1rem;">
				Select your preferred format for the HLS stream export.
			</p>

			<Select
				variant="outlined"
				bind:value={quality}
				label="Quality"
				style="width: 100%; margin-bottom: 1.5rem;"
			>
				{#each qualities as q}
					<Option value={q}>{q}</Option>
				{/each}
			</Select>

			<Select variant="outlined" bind:value={codec} label="Codec" style="width: 100%;">
				{#each codecs as c}
					<Option value={c}>{c}</Option>
				{/each}
			</Select>
		</div>
	</Content>
	<Actions>
		<Button onclick={() => (downloadDialogOpen = false)}>
			<Label>Cancel</Label>
		</Button>
		<Button onclick={downloadHLS} variant="unelevated" disabled={!quality || !codec}>
			<Label>Download</Label>
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

	.table-header {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
		padding-left: 0.5rem;
	}

	.table-title {
		margin: 0;
		font-weight: 500;
	}

	/* NEW: Anchor for the SMUI Badge */
	.title-wrapper {
		position: relative;
		display: inline-block;
		padding-right: 1.5rem; /* Ensures the badge doesn't get cut off if it's pushed to the 'outset' edge */
	}

	/* --- Download Form Styles --- */
	.download-form {
		display: flex;
		flex-direction: column;
		padding-top: 0.5rem;
		min-width: 300px;
		min-height: 250px; /* Gives the Select menus enough room to drop down without clipping */
	}

	:global(.overflow-visible-dialog .mdc-dialog__content) {
		overflow: visible !important;
	}

	/* 2. Allows the main surface of the dialog to let elements float outside of it */
	:global(.overflow-visible-dialog .mdc-dialog__surface) {
		overflow: visible !important;
	}

	/* 3. Ensure the dropdown menus themselves pop to the very front */
	:global(.mdc-select__menu) {
		z-index: 10 !important;
	}

	:global(.empty-table-message) {
		text-align: center;
		padding: 3rem 1rem !important;
	}

	.empty-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		color: var(--mdc-theme-text-secondary-on-background, #888);
	}

	.empty-content .material-icons {
		font-size: 3rem;
		opacity: 0.5;
	}

	:global(.sortable-header) {
		cursor: pointer;
		user-select: none; /* Prevents text from highlighting when rapidly clicking */
		transition: background-color 0.2s ease;
	}

	:global(.sortable-header:hover) {
		background-color: rgba(128, 128, 128, 0.1); /* Subtle hover effect */
	}

	.header-content {
		display: flex;
		align-items: center;
		gap: 4px; /* Space between text and icon */
	}

	:global(.sort-indicator) {
		font-size: 1.1rem !important; /* Slightly smaller than default icons */
		color: var(--mdc-theme-primary, #ff3e00) !important;
	}

	:global(.sort-indicator.placeholder) {
		opacity: 0; /* Keeps the spacing consistent, but invisible */
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
