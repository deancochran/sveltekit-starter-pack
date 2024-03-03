
// Fitness: CTL(t) = CTL(t-1) + (TSS(t) – CTL(t-1))*(1-e^(-1/42))

export function CTL(t: number, TSS: number[], CTL_values: number[]): number {
    // Base case: if t is 0, return the initial value
    if (t === 0) {
        return CTL_values[0];
    }

    // Recursive case
    const last_CTL = CTL(t - 1, TSS, CTL_values);

    // Use the provided equation to calculate the new CTL value
    const new_CTL = last_CTL + (TSS[t] - last_CTL) * (1 - Math.exp(-1/42));

    return new_CTL;
}

export function generate_CTL_array(TSS_values: number[], initial_CTL: number): number[] {
    // Initialize an array to store the CTL values
    const CTL_values: number[] = [initial_CTL];

    // Iterate through each time point in TSS_values and calculate CTL
    for (let t = 1; t < TSS_values.length; t++) {
        const new_CTL = CTL(t, TSS_values, CTL_values);
        CTL_values.push(new_CTL);
    }

    return CTL_values;
}


