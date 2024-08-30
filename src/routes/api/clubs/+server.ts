import { db } from '$lib/drizzle/client';
import { club, clubMember } from '$lib/drizzle/schema';
import { json } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';

export async function GET(event: { url: any }): Promise<Response> {
	const { url } = event;

	try {
		const page = url.searchParams.get('page');
		const take = 5;
		const skip = page * take;
		const clubs = await db
			.select({ club, memberCount: count(clubMember) })
			.from(club)
			.leftJoin(clubMember, eq(club.id, clubMember.clubId))
			.offset(skip)
			.limit(take);
		return json(clubs);
	} catch (error) {
		return json(
			{ message: 'Error retrieving data', error: error },
			{ status: 400 }
		);
	}
}
