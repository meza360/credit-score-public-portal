import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { map, Observable, tap } from 'rxjs';
import { BankCustomer, CreditScoreResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class BancoUnionService {
  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/banco-union/customers';

  constructor (private httpClient: HttpClient) { }

  getCustomerData(cuiToQuery: string): Observable<BankCustomer | null> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath + '/credit-score/report',
      {
        params: {
          'cui': cuiToQuery
          //'cui': '9876543210987'
        }
      }
    )
      .pipe(
        tap(console.debug),
        map<CreditScoreResponse, BankCustomer | null>((response: CreditScoreResponse): BankCustomer | null => {
          if (!response.isSuccess) {
            return null;
          }
          return <BankCustomer>response.value;
        })
      );
  }
}
