import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { CreditScoreResponse, PrivateCustomerDto } from '../../models';
import { map, Observable, tap } from 'rxjs';
import { ChartData } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class EEGSAService {
  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/eegsa/customer';
  constructor (private httpClient: HttpClient) {

  }

  public getCustomerData(cuiToQuery: string): Observable<PrivateCustomerDto | null> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath + '/credit-score/report',
      {
        params: {
          'cui': cuiToQuery
          //'cui': '9876543210987'
          //'nit': '12345678'
        }
      }
    )
      .pipe(
        tap(console.debug),
        map<CreditScoreResponse, PrivateCustomerDto | null>((response: CreditScoreResponse): PrivateCustomerDto | null => {
          if (!response.isSuccess) {
            return null;
          }
          return <PrivateCustomerDto>response.value;
        }
        )
      );
  }
}
