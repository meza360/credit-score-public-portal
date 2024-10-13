import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { CreditScoreResponse } from '../models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {

  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/sat/contributor';
  constructor (private httpClient: HttpClient) {

  }

  public queryContributorReport(): Observable<CreditScoreResponse> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath + '/credit-score',
      {
        headers: {
          'credit-score-key': environment.apiManagementCredentials.creditScoreKey
        },
        params: {
          'cui': '1234567890123'
          //'nit': '12345678'
        }
        /* params: {
          'cui': '9876543210987',
          'nit': '87654321'
        } */
      });
  }
}
