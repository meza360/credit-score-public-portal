import { HistoricalRecordDto } from "./Record";

export interface Entity {
    id: string;
    fullName: string;
    cui: string;
    nit: string;
    privateOverallScore: string;
    bankOverallScore: string;
    taxOverallScore: string;
    monthlyOutcome: number;
    accumulatedDebt: number;
    taxOverallHistory: Array<HistoricalRecordDto>;
    purchaseOverallHistory: Array<HistoricalRecordDto>;
    bankPaymentOverallHistory: Array<HistoricalRecordDto>;
    dateOfBirth: Date | string;
    nationality: string;
}