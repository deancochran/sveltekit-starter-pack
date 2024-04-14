// Assume distance is given in meters
export function convertDistance(
	distance: number,
	unit: 'miles' | 'kilometers' | 'yards' | 'meters' = 'meters'
) {
	distance = Math.round(distance);
	switch (unit) {
		case 'miles':
			return distance * 0.000621371;
		case 'kilometers':
			return distance * 0.001;
		case 'yards':
			return distance * 1.09361;
		case 'meters':
			return distance;
		default:
			return distance;
	}
}
