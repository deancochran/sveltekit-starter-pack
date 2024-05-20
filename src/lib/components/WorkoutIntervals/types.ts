// 0 	Rest 0%
// 1    Active Recovery   < 1-55 %
// 2	Endurance	56-75 %
// 3	Tempo	76-90 %
// 4	Threshold	91-105 %
// 5	VO2 Max	106-120 %
// 6 	Neromuscular > 1200%

export const FTP_INTENSITY = 0.97;

export const intensity_colors = {
	z0: 'bg-gray-500',
	z1: 'bg-blue-500',
	z2: 'bg-green-500',
	z3: 'bg-yellow-500',
	z4: 'bg-orange-500',
	z5: 'bg-red-500',
	z6: 'bg-red-800'
};
// Function to determine intensity color based on value
export function getIntensityColor(intensity: number) {
	if (intensity < 0.01) {
		return intensity_colors.z0;
	} else if (intensity < 0.55 && intensity >= 0.01) {
		return intensity_colors.z1;
	} else if (intensity < 0.75 && intensity >= 0.55) {
		return intensity_colors.z2;
	} else if (intensity < 0.9 && intensity >= 0.75) {
		return intensity_colors.z3;
	} else if (intensity < 1.05 && intensity >= 0.9) {
		return intensity_colors.z4;
	} else if (intensity < 1.2 && intensity >= 1.05) {
		return intensity_colors.z5;
	} else if (intensity >= 1.2) {
		return intensity_colors.z6;
	} else {
		intensity_colors.z0;
	}
}

export function getIntensityZone(
	intensity: number
): 'z0' | 'z1' | 'z2' | 'z3' | 'z4' | 'z5' | 'z6' {
	if (intensity < 0.01) {
		return 'z0';
	} else if (intensity < 0.55 && intensity >= 0.01) {
		return 'z1';
	} else if (intensity < 0.75 && intensity >= 0.55) {
		return 'z2';
	} else if (intensity < 0.9 && intensity >= 0.75) {
		return 'z3';
	} else if (intensity < 1.05 && intensity >= 0.9) {
		return 'z4';
	} else if (intensity < 1.2 && intensity >= 1.05) {
		return 'z5';
	} else if (intensity >= 1.2) {
		return 'z6';
	} else {
		return 'z0';
	}
}
export function getIntensityColorByZoneNumber(zone: number) {
	switch (zone) {
		case 0:
			return intensity_colors.z0;
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
		case 6:
			return intensity_colors.z6;
		default:
			return intensity_colors.z0;
	}
}
