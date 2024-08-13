<script lang="ts">
	import * as d3 from 'd3';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { generate_ATL_array } from '$lib/utils/atl/atl';
	import { generate_CTL_array } from '$lib/utils/ctl/ctl';
	import { FORM } from '$lib/utils/form/form';
	import { ConicGradient, type ConicStop } from '@skeletonlabs/skeleton';
	export let data: PageData;

	const values: Array<[number, number]> = Object.entries(data.agg_activities).map(
		([date_local, act], i) => {
			return [new Date(date_local).valueOf(), act.stress_score];
		}
	);

	$: width = 1000;
	$: height = 600;
	const marginTop = 20;
	const marginRight = 20;
	const marginBottom = 20;
	const marginLeft = 40;
	let gx: SVGGElement;
	let gy: SVGGElement;
	$: dates = Object.entries(data.agg_activities).map(([date_local, day], i) => {
		return new Date(date_local).valueOf();
	});

	$: scores = Object.entries(data.agg_activities).map(([date_local, day], i) => {
		return day.stress_score;
	});
	$: atl_scores = generate_ATL_array(scores, 0);
	$: ctl_scores = generate_CTL_array(scores, 0);
	$: atl_values = atl_scores.map((val, i) => {
		return [dates[i], val];
	}) as [number, number][];
	$: ctl_values = ctl_scores.map((val, i) => {
		return [dates[i], val];
	}) as [number, number][];
	$: form_values = dates.map((date, i) => {
		return [date, FORM(ctl_scores[i], atl_scores[i])];
	}) as [number, number][];

	//@ts-ignore
	$: minx = dates[0];
	$: now = Date.now() + 24 * 60 * 60;
	$: x = d3
		.scaleUtc()
		.range([marginLeft, width - marginRight])
		//@ts-ignore
		.domain([minx, now]);

	// @ts-ignore
	$: y = d3.scaleLinear([-100, d3.max(scores) + 100], [height - marginBottom, marginTop]);
	// TSS PATH AUC
	$: area = d3
		.area()
		.x((d) => x(d[0]))
		.y0(y(0))
		.y1((d) => y(d[1]))
		.curve(d3.curveMonotoneX);

	$: line = d3
		.line()
		// .defined((d) => (d[1]?true:false))
		.x((d) => x(d[0]))
		.y((d) => y(d[1]))
		.curve(d3.curveMonotoneX);

	$: d3.select(gy).call(d3.axisLeft(y));
	//@ts-ignore
	$: d3.select(gx).call(
		//@ts-ignore
		d3.axisBottom(x).ticks(d3.timeDay.every(1)).tickFormat(d3.timeFormat('%m-%d-%y'))
	);
	let svg: SVGElement;
	onMount(resize);

	function resize() {
		({ width, height } = svg.getBoundingClientRect());
	}

	// function hanleConicStops8020(): ConicStop[] {
	// 	let total_moving_time = data
	// 		.user!.activities.map((act, i) => {
	// 			return act.duration;
	// 		})
	// 		.reduce((a, b) => a + b, 0);
	// 	let total_time_above_threshold = data
	// 		.user!.activities.filter((act) => {
	// 			return act.intensity_factor_score >= 1;
	// 		})
	// 		.map((act, i) => {
	// 			return act.duration;
	// 		})
	// 		.reduce((a, b) => a + b, 0);

	// 	let percent_above_threshold = total_time_above_threshold / total_moving_time;
	// 	let display_percent_above_threshold = percent_above_threshold * 100;

	// 	const conicStops: ConicStop[] = [
	// 		{
	// 			label: 'Above Threshold',
	// 			color: 'rgb(var(--color-primary-500))',
	// 			start: 0,
	// 			end: display_percent_above_threshold
	// 		},
	// 		{
	// 			label: 'Below Threshold',
	// 			color: 'rgb(var(--color-secondary-500))',
	// 			start: display_percent_above_threshold,
	// 			end: 100
	// 		}
	// 	];
	// 	return conicStops;
	// }
</script>

<div class=" flex md:flex-row flex-col">
	<div class="card w-full p-8">
		<svg bind:this={svg} class="m-auto w-full h-[50vh]">
			<g bind:this={gx} transform="translate(0,{height - marginBottom})"> </g>
			<g bind:this={gy} transform="translate({marginLeft},0)"></g>

			<!-- TSS POINTS -->
			<g>
				{#each values as [date, score], i}
					<circle class="fill-primary-600" cx={x(date)} cy={y(score)} r="3.5" />
				{/each}
			</g>
			<!-- TSS PATH  -->
			<path class="fill-none stroke-1 stroke-primary-600" d={line(values)} />
			<!-- TSS PATH AUC -->
			<!-- <path class="hover:fill-primary-600/15 fill-primary-500/15" d={area(values)}></path> -->
			<!-- CTL POINTS -->
			<g stroke-width="1">
				{#each ctl_scores as val, i}
					<circle class="fill-blue-600" cx={x(dates[i])} cy={y(val)} r="3.5" />
				{/each}
			</g>
			<!-- CTL PATH  -->
			<path class="fill-none stroke-1 stroke-blue-600" d={line(ctl_values)} />
			<!-- ATL POINTS -->
			<g stroke-width="1">
				{#each atl_scores as val, i}
					<circle class="fill-red-600" cx={x(dates[i])} cy={y(val)} r="3.5" />
				{/each}
			</g>
			<!-- ATL PATH  -->
			<path class="fill-none stroke-1 stroke-red-600" d={line(atl_values)} />
			<!-- FORM POINTS -->
			<g stroke-width="1">
				{#each form_values as [date, form_val], i}
					<circle class="fill-red-600" cx={x(date)} cy={y(form_val)} r="3.5" />
				{/each}
			</g>
			<!-- ATL PATH  -->
			<path class="fill-none stroke-1 stroke-yellow-600" d={line(form_values)} />
			<!-- TSS PATH  -->
			<!-- <path class="fill-none"  d={line(values)} /> -->
			<!-- TSS PATH AUC -->
			<!-- <path
			class="hover:fill-primary-600/15 fill-primary-500/15 stroke-primary-500 transition-all duration-200 ease-in-out"
			d={area(values)}
		></path> -->
		</svg>
	</div>
	<div class="card w-full p-8 flex items-center align-middle justify-center">
		<!-- {#await hanleConicStops8020() then conicStops}
			<ConicGradient stops={conicStops} legend>80/20 Chart</ConicGradient>
		{/await} -->
	</div>
</div>
