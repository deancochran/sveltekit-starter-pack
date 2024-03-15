import { type calendar, type event, type user } from '@prisma/client';

// Function to add bulk events to a user's calendar
export async function addEvents(
	user: user & { calendar: calendar },
	eventsData: Array<event>
): Promise<void> {
	// Create events for the user
	eventsData.map(async (eventData) => {
		await prisma.event.create({
			data: {
				...eventData
			}
		});
	});
}
