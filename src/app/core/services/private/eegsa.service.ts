import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { CreditScoreResponse } from '../../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EEGSAService {
  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/eegsa/customer';
  constructor (private httpClient: HttpClient) {

  }

  public getCustomerData(): Observable<CreditScoreResponse> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath + '/credit-score',
      {
        headers: {
          'credit-score-api-01': environment.apiManagementCredentials.creditScoreKey
        },
        params: {
          'cui': '1234567890123'
          //'nit': '12345678'
        }
      }
    );
  }
}
