// import type { LngLatLike } from 'maplibre-gl';

// export type StravaActicity = {
// 	resource_state?: number;
// 	athlete?: {
// 		id: number;
// 		resource_state: number;
// 	};
// 	name?: string;
// 	distance?: number;
// 	moving_time?: number;
// 	elapsed_time?: number;
// 	total_elevation_gain?: number;
// 	type?: string;
// 	sport_type?: string;
// 	id?: number;
// 	start_date?: Date;
// 	start_date_local?: Date;
// 	timezone?: string;
// 	utc_offset?: number;
// 	location_city?: unknown;
// 	location_state?: unknown;
// 	location_country?: unknown;
// 	achievement_count?: number;
// 	kudos_count?: number;
// 	comment_count?: number;
// 	athlete_count?: number;
// 	photo_count?: number;
// 	map?: {
// 		id?: number;
// 		summary_polyline?: string;
// 		resource_state?: number;
// 	};
// 	trainer?: boolean;
// 	commute?: boolean;
// 	manual?: boolean;
// 	private?: boolean;
// 	visibility?: string;
// 	flagged?: boolean;
// 	gear_id?: unknown;
// 	start_latlng?: LngLatLike;
// 	end_latlng?: LngLatLike;
// 	average_speed?: number;
// 	max_speed?: number;
// 	has_heartrate?: boolean;
// 	average_heartrate?: number;
// 	max_heartrate?: number;
// 	heartrate_opt_out?: boolean;
// 	display_hide_heartrate_option?: boolean;
// 	elev_high?: number;
// 	elev_low?: number;
// 	upload_id?: number;
// 	upload_id_str?: number;
// 	external_id?: string;
// 	from_accepted_tag?: boolean;
// 	pr_count?: number;
// 	total_photo_count?: number;
// 	has_kudoed?: boolean;
// };

export type StravaSubscriptionWebhookEvent = {
	object_type: 'activity' | 'athlete';
	object_id: number;
	aspect_type: 'create' | 'update' | 'delete';
	updates: object;
	owner_id: number;
	subscription_id: number;
	event_time: number;
};
