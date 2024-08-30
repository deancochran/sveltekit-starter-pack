// Fatigue: ATL(t) = ATL(t-1) + (TSS(t) – ATL(t-1))*(1-e^(-1/7))

export function ATL(t: number, TSS: number[], ATLValues: number[]): number {
	// Base case: if t is 0, return the initial value
	if (t === 0) {
		return ATLValues[0];
	}

	// Recursive case
	const lastATL = ATL(t - 1, TSS, ATLValues);

	// Use the provided equation to calculate the new ATL value
	const newATL = lastATL + (TSS[t] - lastATL) * (1 - Math.exp(-1 / 7));

	return newATL;
}

export function generateATLArray(
	TSSValues: number[],
	initialATL: number
): number[] {
	// Initialize an array to store the ATL values
	const ATLValues: number[] = [initialATL];

	// Iterate through each time point in TSSValues and calculate ATL
	for (let t = 1; t < TSSValues.length; t++) {
		const newATL = ATL(t, TSSValues, ATLValues);
		ATLValues.push(newATL);
	}

	return ATLValues;
}
