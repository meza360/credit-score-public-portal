export interface Citizen {
    id: number;
    cui: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date | string;
    nationality: string;
}