import { ContributorDto } from "./Contributor";

export interface CreditScoreResponse {
    isSuccess: boolean;
    value: ContributorDto;
}