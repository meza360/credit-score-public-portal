import { HistoricalRecordDto } from ".";

export interface BankCustomer {
    id: string;
    fullName: string;
    cui: string;
    lastUpdate: Date | string;
    bankScore: string;
    accumulatedDebt: number;
    creditHistoricalRecord: Array<HistoricalRecordDto>;
    loanHistoricalRecord: Array<HistoricalRecordDto>;
}