export const toDateTime = (secs: number): Date => {
	const t = new Date('1970-01-01T00:30:00Z'); // Unix epoch start.
	t.setSeconds(secs);
	return t;
};

// Helper function to add days to the current date
export function addDays(date: Date, days: number): Date {
	const newDate = new Date(date);
	newDate.setDate(date.getDate() + days);
	return newDate;
}

type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replace('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}

export function getMostRecentSunday(): Date {
	const today = new Date();
	const dayOfWeek = today.getDay();
	const sundayOffset = dayOfWeek === 0 ? 0 : dayOfWeek;
	const mostRecentSunday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() - sundayOffset
	);
	return mostRecentSunday;
}

export function convertSecondsToTimeDisplay(seconds: number | undefined): {
	hours: number;
	mins: number;
	secs: number;
} {
	if (!seconds) seconds = 0;
	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;
	return { hours, mins, secs };
}

export function secondsToHHMMSS(seconds: number): string {
	if (!seconds) return '00:00:00';
	// Calculate hours, minutes, and remaining seconds
	const hours: number = Math.floor(seconds / 3600);
	seconds %= 3600;
	const minutes: number = Math.floor(seconds / 60);
	seconds %= 60;

	// Format the time
	let timeStr: string = '';
	if (hours > 0) {
		timeStr += `${String(hours).padStart(2, '0')}:`;
	}
	if (hours > 0 || minutes > 0) {
		timeStr += `${String(minutes).padStart(2, '0')}:`;
	}
	timeStr += `${String(seconds).padStart(2, '0')}`;

	return timeStr;
}
