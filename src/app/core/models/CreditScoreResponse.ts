import {
    BankCustomer,
    Citizen,
    ContributorDto,
    Entity,
    PrivateCustomerDto
} from "./index";

export interface CreditScoreResponse {
    isSuccess: boolean;
    value: ContributorDto | PrivateCustomerDto | BankCustomer | Citizen | Entity;
}