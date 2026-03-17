<script lang="ts">
	// import Card, { Content, PrimaryAction } from '@smui/card';
	// import { Title, Subtitle } from '@smui/paper';
	// import Snackbar, { Actions, Label } from '@smui/snackbar';
	// import Button from '@smui/button';

	// let snackbarWithClose: Snackbar;
	// let snackbarWithoutClose: Snackbar;
	import Button, { Label, Icon } from '@smui/button';
	import Textfield from '@smui/textfield';
	// import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Dialog, { Header, Title, Content, Actions } from '@smui/dialog';
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import CircularProgress from '@smui/circular-progress';
	import ChipInput from '@smui-extra/chip-input';

	import Paper from '@smui/paper';
	import Fab from '@smui/fab';

	let searchQuery = $state('');
	let filterDialogOpen = $state(false);
	let downloadDialogOpen = $state(false);

	let categories = $state(['Productivity', 'Audio & Video']);
	let value = $state('');

	const categoryList = [
		'Productivity',
		'Graphics & Photography',
		'Audio & Video',
		'Education',
		'Games',
		'Networking',
		'Developer Tools',
		'Science',
		'System',
		'Utilities'
	];

  let tags = $state([]);
  const tagList: string[] = [];


	function doSearch() {
		alert('Search for ' + value);
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			doSearch();
		}
	}

	let infos = null;

	let query_params = { tags: [], performers: [], network: null };

	async function fetchData() {
		const res = await fetch('http://127.0.0.1:8000/api/items/');
		if (res.ok) {
			infos = await res.json();
			infos.tags.array.forEach(element => {
        tagList.push(element);
      });
		} else {
			throw new Error('Failed to fetch data');
		}
	}

  await fetchData();

	async function fetchVideosAll() {
		const res = await fetch('http://127.0.0.1:8000/api/videos/');
		if (res.ok) {
			return await res.json();
		} else {
			throw new Error('Failed to fetch data');
		}
	}
</script>

<svelte:head>
	<title>Home - SuperApp</title>
</svelte:head>

<!-- <div class="hero">
  <h1 class="mdc-typography--headline3">Welcome to SuperApp</h1>
  <p class="mdc-typography--body1">Your trusted source for premium Ayurvedic medicines and natural herbs.</p>
</div> -->

<!-- <div class="card-container">
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
</div> -->
{#await fetchVideosAll()}
	<CircularProgress style="height: 32px; width: 32px;" indeterminate />
{:then videos}
	<div class="dashboard-container">
		<div class="action-bar">
			<div class="search-wrapper">
				<Paper class="solo-search-paper" elevation={1}>
					<Icon class="material-icons search-icon">search</Icon>
					<input type="text" bind:value={searchQuery} placeholder="Search" class="solo-input" />
				</Paper>

				<Fab color="primary" mini class="search-fab">
					<Icon class="material-icons">arrow_forward</Icon>
				</Fab>
			</div>

			<Button variant="unelevated" onclick={() => (filterDialogOpen = true)}>
				<Icon class="material-icons">filter_list</Icon>
				<Label>Filter</Label>
			</Button>

			<Button variant="outlined" onclick={() => (downloadDialogOpen = true)}>
				<Icon class="material-icons">download</Icon>
				<Label>Download</Label>
			</Button>
		</div>
		<div class="table-container">
			<DataTable style="width: 100%;">
				<Head>
					<Row>
						<Cell>Title</Cell>
						<Cell>URL</Cell>
						<Cell>Network</Cell>
					</Row>
				</Head>
				<Body>
					{#each videos.results as row}
						<Row>
							<Cell>{row.title}</Cell>
							<Cell>{row.url}</Cell>
							<Cell>{row.network_name}</Cell>
						</Row>
					{/each}
				</Body>
			</DataTable>
		</div>
	</div>
{:catch error}
	<p>{error}</p>
{/await}

<Dialog bind:open={filterDialogOpen} aria-labelledby="filter-title">
	<Title id="filter-title">Filter Content</Title>
	<Content>
		<div class="filter-form">
			<ChipInput
				bind:chips={categories}
				bind:value
				chipTrailingAction$class="material-icons"
				chipTrailingAction$aria-label="Remove category"
				autocomplete$options={categoryList.filter(
					(category) => !categories.find((cat) => cat === category)
				)}
				autocomplete$showMenuWithNoInput
			>
				{#snippet chipTrailingAction()}cancel{/snippet}
				{#snippet label()}
					Categories
				{/snippet}
			</ChipInput>
		</div>
	</Content>
</Dialog>

<Dialog
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
			autocomplete$options={tagList.filter(
				(category) => !tags.find((cat) => cat === category)
			)}
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
</Dialog>

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
  .action-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
  }
</style>
