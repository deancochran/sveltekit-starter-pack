// Fitness: CTL(t) = CTL(t-1) + (TSS(t) – CTL(t-1))*(1-e^(-1/42))

export function CTL(t: number, TSS: number[], CTLValues: number[]): number {
	// Base case: if t is 0, return the initial value
	if (t === 0) {
		return CTLValues[0];
	}

	// Recursive case
	const lastCTL = CTL(t - 1, TSS, CTLValues);

	// Use the provided equation to calculate the new CTL value
	const newCTL = lastCTL + (TSS[t] - lastCTL) * (1 - Math.exp(-1 / 42));

	return newCTL;
}

export function generateCTLArray(
	TSSValues: number[],
	initialCTL: number
): number[] {
	// Initialize an array to store the CTL values
	const CTLValues: number[] = [initialCTL];

	// Iterate through each time point in TSSValues and calculate CTL
	for (let t = 1; t < TSSValues.length; t++) {
		const newCTL = CTL(t, TSSValues, CTLValues);
		CTLValues.push(newCTL);
	}

	return CTLValues;
}
