<script lang="ts">
	import { page } from '$app/stores';
	import { AppRail, AppRailAnchor } from '@skeletonlabs/skeleton';
	import type { LayoutData } from './$types';
	// export let data: LayoutData;
</script>

<AppRail class="w-fit">
	<svelte:fragment slot="lead">
		<AppRailAnchor
			href="/settings"
			title="Profile"
			regionLabel={'px-4'}
			active={'bg-surface-active-token'}
			selected={$page.url.pathname == '/settings'}
			aspectRatio="aspect-video"
		>
			<div class="flex flex-row items-center align-middle justify center">
				<span class="p-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
						><path
							class=" "
							fill="currentColor"
							d="M5.85 17.1q1.275-.975 2.85-1.538T12 15q1.725 0 3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4Q8.675 4 6.337 6.337T4 12q0 1.475.488 2.775T5.85 17.1ZM12 13q-1.475 0-2.488-1.012T8.5 9.5q0-1.475 1.012-2.488T12 6q1.475 0 2.488 1.012T15.5 9.5q0 1.475-1.012 2.488T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"
						/></svg
					>
				</span>
				<span class="text-xl font-normal">Profile</span>
			</div>
		</AppRailAnchor>
	</svelte:fragment>
	<AppRailAnchor
		href="/settings/account"
		title="Profile"
		regionLabel={'px-4'}
		active={'bg-surface-active-token'}
		selected={$page.url.pathname == '/settings/account'}
		aspectRatio="aspect-video"
	>
		<div class="flex flex-row items-center align-middle justify center">
			<span class="p-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
					><path
						fill="currentColor"
						d="M10 12q-1.65 0-2.825-1.175T6 8q0-1.65 1.175-2.825T10 4q1.65 0 2.825 1.175T14 8q0 1.65-1.175 2.825T10 12Zm-7 8q-.425 0-.713-.288T2 19v-1.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T10 13h.35q.15 0 .3.05q-.2.45-.338.938T10.1 15q-.125.9-.075 1.513T10.3 18q.15.525.4 1.038t.55.962H3Zm14-2q.825 0 1.413-.588T19 16q0-.825-.588-1.413T17 14q-.825 0-1.413.588T15 16q0 .825.588 1.413T17 18Zm-1.3 1.5q-.3-.125-.563-.263T14.6 18.9l-1.075.325q-.175.05-.325-.013T12.95 19l-.6-1q-.1-.15-.062-.325t.187-.3l.825-.725q-.05-.35-.05-.65t.05-.65l-.825-.725q-.15-.125-.187-.3T12.35 14l.6-1q.1-.15.25-.212t.325-.013l1.075.325q.275-.2.538-.337t.562-.263l.225-1.1q.05-.175.175-.288t.3-.112h1.2q.175 0 .3.113t.175.287l.225 1.1q.3.125.563.275t.537.375l1.05-.375q.175-.075.338 0t.262.225l.6 1.05q.1.15.075.325t-.175.3l-.85.725q.05.3.05.625t-.05.625l.825.725q.15.125.188.3T21.65 18l-.6 1q-.1.15-.25.213t-.325.012L19.4 18.9q-.275.2-.537.338t-.563.262l-.225 1.1q-.05.175-.175.288t-.3.112h-1.2q-.175 0-.3-.112t-.175-.288l-.225-1.1Z"
					/></svg
				>
			</span>
			<span class="text-xl font-normal">Account</span>
		</div>
	</AppRailAnchor>
</AppRail>

<slot />