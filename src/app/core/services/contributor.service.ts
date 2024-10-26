import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ContributorDto, CreditScoreResponse } from '../models';
import { map, Observable, tap } from 'rxjs';
import { ChartData, ChartDataset } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ContributorService {

  private serviceBaseUrl: string = environment.apiUrl + environment.apiPrefix;
  private queryingPath: string = '/v1/querying/sat/contributor';
  constructor (private httpClient: HttpClient) {

  }

  public queryContributorReport(cuiToQuery: string): Observable<{ chartData: ChartData<'line'> | null, contributor: ContributorDto; } | null> {
    return this.httpClient.get<CreditScoreResponse>(this.serviceBaseUrl + this.queryingPath + '/credit-score/report',
      {
        params: {
          'cui': cuiToQuery
          //'cui': '9876543210987'
          //'nit': '12345678'
        }
      })
      .pipe(
        tap(console.debug),
        map<CreditScoreResponse, { chartData: ChartData<'line'> | null, contributor: ContributorDto; } | null>((response: CreditScoreResponse): { chartData: ChartData<'line'> | null, contributor: ContributorDto; } | null => {
          if (!response.isSuccess) {
            return null;
          }
          let data: ChartData<'line'> | null = null;
          let impositionHistoricalData: Array<string> = [];
          let impositionHistoricalPaymentData: Array<number> = [];
          let statementHistoricalData: Array<string> = [];
          let statementHistoricalPaymentData: Array<number> = [];
          let dataSets: ChartDataset<'line', number[]>[] = [];
          if (Array.isArray((<ContributorDto>response.value).impositionHistoricalRecord) && (<ContributorDto>response.value).impositionHistoricalRecord.length > 0) {
            impositionHistoricalData = (<ContributorDto>response.value).impositionHistoricalRecord
              .map((imposition) => {
                return new Date(imposition.year, imposition.month).toISOString().split("T")[0];
              });
            impositionHistoricalPaymentData = (<ContributorDto>response.value).impositionHistoricalRecord
              .map((imposition) => {
                return imposition.paymentAmount;
              });

            dataSets.push({
              label: 'Facturacion mensual(compras)',
              data: impositionHistoricalPaymentData,
              xAxisID: 'Fechas de compra',
              yAxisID: 'Monto de compra',
              fill: {
                target: 'origin',
                above: 'rgb(75,192,192,0.25)',   // Area will be blue above the origin
                below: 'rgb(75, 192, 192)'    // And blue below the origin
              },
              borderColor: 'rgb(75, 192, 192)',
              borderJoinStyle: 'bevel',
              tension: 0.1
            });
          }
          if (Array.isArray((<ContributorDto>response.value).statementHistoricalRecord) && (<ContributorDto>response.value).statementHistoricalRecord.length > 0) {
            statementHistoricalData = (<ContributorDto>response.value).statementHistoricalRecord
              .map((statement) => {
                return new Date(statement.year, statement.month).toISOString().split("T")[0];
              });
            statementHistoricalPaymentData = (<ContributorDto>response.value).statementHistoricalRecord
              .map((statement) => {
                return statement.statementAmount;
              });

            dataSets.push({
              label: 'Declaraciones mensuales(ventas)',
              data: statementHistoricalPaymentData,
              xAxisID: 'Fechas de venta',
              yAxisID: 'Monto de venta',
              fill: {
                target: 'origin',
                above: 'rgb(218, 60, 58,0.25)',   // Area will be blue above the origin
                below: 'rgb(75, 192, 192)'    // And blue below the origin
              },
              borderColor: 'rgb(218, 60, 58)',
              borderJoinStyle: 'bevel',
              tension: 0.1
            });
          }

          if (dataSets.length == 0) {
            return { chartData: null, contributor: <ContributorDto>response.value };
          }
          data = {
            labels: impositionHistoricalData.length > 0 ? impositionHistoricalData : statementHistoricalData.length > 0 ? statementHistoricalData : [],
            datasets: dataSets
          };
          return { chartData: data, contributor: <ContributorDto>response.value };
        })
      );
  }
}
