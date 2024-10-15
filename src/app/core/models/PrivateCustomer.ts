import { HistoricalRecordDto } from ".";

export interface PrivateCustomerDto {
    id: string;
    fullName: string;
    cui: string;
    lastUpdate: Date | string;
    privateScore: string;
    accumulatedDebt: number;
    historicalRecord: Array<HistoricalRecordDto>;
}