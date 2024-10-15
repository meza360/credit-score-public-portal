import {
    BankCustomer,
    ContributorDto,
    PrivateCustomerDto
} from "./index";

export interface CreditScoreResponse {
    isSuccess: boolean;
    value: ContributorDto | PrivateCustomerDto | BankCustomer;
}