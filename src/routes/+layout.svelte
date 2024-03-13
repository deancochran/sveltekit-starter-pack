<script lang="ts">
	import SearchWorker from '@lib/utils/posts/search-worker?worker';
	import '../app.pcss';
	import { Button } from '$lib/components/ui/button';
	// import { ModeWatcher, toggleMode } from 'mode-watcher';
	// import Sun from 'svelte-radix/Sun.svelte';
	// import Moon from 'svelte-radix/Moon.svelte';

	import * as DropdownMenu from '@lib/components/ui/dropdown-menu';
	import * as Avatar from '@lib/components/ui/avatar';
	import { Moon, Sun, File, Laptop, Circle } from 'lucide-svelte';
	import { Input } from '@lib/components/ui/input';
	import * as Command from '@lib/components/ui/command';
	import { docsConfig, site_name } from '@lib/config/site';
	import { page } from '$app/stores';
	import { cn } from '@lib/utils.js';
	import { ModeWatcher, resetMode, setMode, toggleMode } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Transition from '@lib/components/ui/transition/transition.svelte';
	import type { SearchPostsResult } from '@lib/utils/posts/search';
	export let data;
	let open = false;

	onMount(() => {
		/**
		 * @param {{ key: string; metaKey: any; ctrlKey: any; preventDefault: () => void; }} e
		 */
		function handleKeydown(e: KeyboardEvent) {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				e.stopPropagation();
				open = true;
			}
		}
		document.addEventListener('keydown', handleKeydown);

		// create worker
		searchWorker = new SearchWorker();
		// listen for messages
		searchWorker.addEventListener('message', (e) => {
			const { type, payload } = e.data;
			type === 'ready' && (search = 'ready');
			type === 'results' && (results = payload.results);
		});
		// initialize when the component mounts
		searchWorker.postMessage({ type: 'load' });

		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});

	function runCommand(cmd: Function) {
		open = false;
		cmd();
	}

	const mainNav = docsConfig.mainNav;

	let search: 'idle' | 'load' | 'ready' = 'idle';
	let searchTerm = '';
	let results: SearchPostsResult[] = [];
	let searchWorker: Worker;
	$: if (search === 'ready') {
		// update results
		searchWorker.postMessage({ type: 'search', payload: { searchTerm } });
	}
</script>

<!-- 
    <h1>Welcome to SvelteKit</h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p> 
-->
<ModeWatcher />

<div class="flex flex-col items-center">
	<div class="flex h-16 w-full items-center justify-between border-b px-4 align-middle">
		<!-- <TeamSwitcher /> -->

		<div class="mr-4 flex">
			<a href="/" class="mr-6 flex items-center space-x-2">
				<span class="flex font-bold">
					{site_name}
				</span>
			</a>
			<nav class="hidden items-center gap-6 text-sm sm:flex">
				<a
					href="/"
					class={cn(
						'transition-colors hover:text-foreground/80',
						$page.url.pathname === '/' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Dashboard
				</a>
				<a
					href="/blog"
					class={cn(
						'transition-colors hover:text-foreground/80',
						$page.url.pathname === '/blog' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
					Blog
				</a>
			</nav>
		</div>

		<div class="ml-auto flex items-center space-x-4">
			<div>
				<!-- <Input type="search" placeholder="Search..." class="h-9 w-[50vw] sm:w-[25vw]" /> -->
				<Button
					variant="outline"
					class={cn(
						'relative flex w-full items-center justify-between space-x-4 align-middle text-sm text-muted-foreground'
					)}
					on:click={() => (open = true)}
					{...$$restProps}
				>
					<p class="flex">Search...</p>

					<kbd
						class="pointer-events-none mt-[2px] flex h-4 select-none items-center justify-center rounded border bg-muted px-2 pt-1 align-middle font-mono text-[10px] font-medium opacity-100"
					>
						Ctrl-K
					</kbd>
				</Button>
				<Command.Dialog bind:open>
					<Command.Input bind:value={searchTerm} placeholder="Type a command or search" />
					<Command.List>
						{#if results.length < 1}
							<Command.Empty>No results found.</Command.Empty>
						{:else}
							<Command.Group heading="Posts">
								{#each results as result}
									<Command.Item
										value={result.title}
										onSelect={() =>
											runCommand(() => {
												result.slug && goto(`/blog/${result.slug}`);
											})}
									>
										<File class="mr-2 h-4 w-4" />
										{@html result.title}
									</Command.Item>
								{/each}
							</Command.Group>
						{/if}
						<Command.Group heading="Links">
							{#each mainNav as navItem}
								<Command.Item
									value={navItem.title}
									onSelect={() =>
										runCommand(() => {
											navItem.href && goto(navItem.href);
										})}
								>
									<File class="mr-2 h-4 w-4" />
									{navItem.title}
								</Command.Item>
							{/each}
						</Command.Group>
						<Command.Separator />
						<Command.Group heading="Theme">
							<Command.Item value="light" onSelect={() => runCommand(() => setMode('light'))}>
								<Sun class="mr-2 h-4 w-4" />
								Light
							</Command.Item>
							<Command.Item value="dark" onSelect={() => runCommand(() => setMode('dark'))}>
								<Moon class="mr-2 h-4 w-4" />
								Dark
							</Command.Item>
							<Command.Item value="system" onSelect={() => runCommand(() => resetMode())}>
								<Laptop class="mr-2 h-4 w-4" />
								System
							</Command.Item>
						</Command.Group>
					</Command.List>
				</Command.Dialog>
			</div>
			<Button on:click={toggleMode} variant="outline" size="icon">
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			{#if $page.data.user}
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
							<Avatar.Root class="h-8 w-8">
								<Avatar.Image alt="@{$page.data.user.username}" />
								<!-- <Avatar.Image 
                                src="/avatars/01.png" alt="@shadcn" 
                                /> -->
								<Avatar.Fallback>user</Avatar.Fallback>
							</Avatar.Root>
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56" align="end">
						<DropdownMenu.Label class="font-normal">
							<div class="flex flex-col space-y-1">
								<p class="text-sm font-medium leading-none">shadcn</p>
								<p class="text-xs leading-none text-muted-foreground">m@example.com</p>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								Settings
								<!-- <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut> -->
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							Log out
							<!-- <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut> -->
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			{/if}
		</div>
	</div>

	<div class="flex items-center justify-center p-4 align-middle">
		<Transition bind:url={data.pathname}>
			<slot />
		</Transition>
	</div>
</div>
