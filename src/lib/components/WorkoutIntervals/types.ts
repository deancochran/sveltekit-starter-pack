// 1    Active Recovery   < 55 %
// 2	Endurance	56-75 %
// 3	Tempo	76-90 %
// 4	Threshold	91-105 %
// 5	VO2 Max	106-120 %

export const FTP_INTENSITY = 0.97;

export const intensity_colors = {
	z1: 'bg-blue-500',
	z2: 'bg-green-500',
	z3: 'bg-yellow-500',
	z4: 'bg-orange-500',
	z5: 'bg-red-500'
};
// Function to determine intensity color based on value
export function getIntensityColor(intensity: number) {
	if (intensity < 0.55) {
		return intensity_colors.z1;
	} else if (intensity < 0.75 && intensity >= 0.55) {
		return intensity_colors.z2;
	} else if (intensity < 0.9 && intensity >= 0.75) {
		return intensity_colors.z3;
	} else if (intensity < 1.05 && intensity >= 0.9) {
		return intensity_colors.z4;
	} else if (intensity >= 1.05) {
		return intensity_colors.z5;
	} else {
		('bg-gray-500');
	}
}

export function getIntensityZone(intensity: number): 'z1' | 'z2' | 'z3' | 'z4' | 'z5' {
	if (intensity < 0.55) {
		return 'z1';
	} else if (intensity < 0.75 && intensity >= 0.55) {
		return 'z2';
	} else if (intensity < 0.9 && intensity >= 0.75) {
		return 'z3';
	} else if (intensity < 1.05 && intensity >= 0.9) {
		return 'z4';
	} else if (intensity >= 1.05) {
		return 'z5';
	} else {
		return 'z1';
	}
}
export function getIntensityColorByZoneNumber(zone: number) {
	switch (zone) {
		case 1:
			return intensity_colors.z1;
		case 2:
			return intensity_colors.z2;
		case 3:
			return intensity_colors.z3;
		case 4:
			return intensity_colors.z4;
		case 5:
			return intensity_colors.z5;
		default:
			return intensity_colors.z1;
	}
}
