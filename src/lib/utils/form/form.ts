// Form: TSB(t) = CTL(t-1) – ATL(t-1)

export function FORM(CTL: number, ATL: number): number {
    return CTL - ATL
}
