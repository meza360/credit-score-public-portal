import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Citizen, CreditScoreResponse } from '../models';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitizenService {
  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/renap/citizen';
  constructor (private httpClient: HttpClient) { }

  getCitizenData(cuiToQuery: string): Observable<Citizen | null> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath,
      {
        params: {
          cui: cuiToQuery
        }
      })
      .pipe(
        tap(console.debug),
        map<CreditScoreResponse, Citizen | null>((response: CreditScoreResponse): Citizen | null => {
          if (response.isSuccess) {
            return response.value as Citizen;
          }
          return null;
        })
      );
  }
}
