// Fatigue: ATL(t) = ATL(t-1) + (TSS(t) – ATL(t-1))*(1-e^(-1/7))

export function ATL(t: number, TSS: number[], ATL_values: number[]): number {
	// Base case: if t is 0, return the initial value
	if (t === 0) {
		return ATL_values[0];
	}

	// Recursive case
	const last_ATL = ATL(t - 1, TSS, ATL_values);

	// Use the provided equation to calculate the new ATL value
	const new_ATL = last_ATL + (TSS[t] - last_ATL) * (1 - Math.exp(-1 / 7));

	return new_ATL;
}

export function generate_ATL_array(TSS_values: number[], initial_ATL: number): number[] {
	// Initialize an array to store the ATL values
	const ATL_values: number[] = [initial_ATL];

	// Iterate through each time point in TSS_values and calculate ATL
	for (let t = 1; t < TSS_values.length; t++) {
		const new_ATL = ATL(t, TSS_values, ATL_values);
		ATL_values.push(new_ATL);
	}

	return ATL_values;
}
