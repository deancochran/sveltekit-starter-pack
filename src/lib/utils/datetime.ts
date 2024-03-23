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
