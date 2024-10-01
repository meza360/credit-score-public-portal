export interface ContributorDto {
    id: string;
    cui: string;
    nit: string;
    fullName: string;
    lastUpdate: Date | string;
    accumulatedDebt: number;
    impositionHistoricalRecord: Array<ImpositionDto>;
    statementHistoricalRecord: Array<StatementDto>;
}

export interface ImpositionDto {
    paymentDate: Date | string;
    paymentAmount: number;
    contributorId: number;
    year: number;
    month: number;
}

export interface StatementDto {
    month: number;
    year: number;
    wasDue: boolean;
    daysOverdue: number;
    statementAmount: number;
}