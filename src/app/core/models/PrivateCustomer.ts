export interface PrivateCustomerDto {
    id: string;
    fullName: string;
    cui: string;
    lastUpdate: Date | string;
    privateScore: number;
    accumulatedDebt: number;
    historicalRecord: Array<HistoricalRecordDto>;
}

export interface HistoricalRecordDto {
    month: number;
    year: number;
    wasDue: boolean;
    daysDue: number;
}