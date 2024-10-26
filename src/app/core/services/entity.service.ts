import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { CreditScoreResponse, Entity } from '../models';
import { map, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/reports/credit-score';
  constructor (private httpClient: HttpClient) { }

  getEntityReport(cuiParam: string): Observable<Entity | null> {
    return this.httpClient.get<CreditScoreResponse>(`${this.serviceBaseUrl}${this.queryingPath}/entity`,
      {
        params: {
          cui: cuiParam
        }
      })
      .pipe(
        tap(console.debug),
        map<CreditScoreResponse, Entity | null>((response: CreditScoreResponse): Entity | null => {
          if (response.isSuccess) {
            return response.value as Entity;
          }
          return null;
        })
      );
  }
}
