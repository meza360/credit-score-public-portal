export interface HistoricalRecordDto {
    id?: string;
    month: number;
    year: number;
    wasDue?: boolean;
    daysDue?: number;
    amount?: number;
    total?: number;
    type: string;
}