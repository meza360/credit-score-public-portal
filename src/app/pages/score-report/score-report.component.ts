import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Filler, LegendElement, Legend, ChartData, ChartType, DoughnutController, DoughnutControllerChartOptions, ArcElement } from 'chart.js';
import { ContributorDto, CreditScoreResponse, PrivateCustomerDto } from '../../core/models';
import { ContributorService } from '../../core/services/contributor.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UtilService } from '../../core/services/util.service';
import { EEGSAService } from '../../core/services/private/eegsa.service';

@Component({
  selector: 'app-score-report',
  templateUrl: './score-report.component.html',
  styleUrl: './score-report.component.scss'
})
export class ScoreReportComponent implements AfterViewInit {
  filterForm: FormGroup<{
    startDate: FormControl<Date | null>,
    endDate: FormControl<Date | null>,
  }> = this.formBuilder.group({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null)
  });
  handleFindAvailableDates(event: MatDatepickerInputEvent<Date> | Event | KeyboardEvent) {
    if (event instanceof Event || event instanceof KeyboardEvent) {
      //this.smsCampaignForm.controls.campaignInformation.controls.campaignDate.setValue(null);
      //this.datesSelector.next([]);
    }
    if (event instanceof MatDatepickerInputEvent) {
      //this.utilService.findAvailableDates(event, this.unavailableDates, this.availableSchedules.map((n) => n), this.datesSelector);
    }
  }
  @ViewChild('expensesChart') expensesChartElementRef!: ElementRef;
  @ViewChild('debtChart') debtChartElementRef!: ElementRef;
  minDate: Date | string = new Date();
  maxDate: Date | string = new Date();
  contributor: ContributorDto | null = null;
  eegsaCustomer: PrivateCustomerDto | null = null;
  expensesChart: Chart | null = null;
  debtChart: Chart | null = null;
  constructor (
    private contributorService: ContributorService,
    private eegsaService: EEGSAService,
    private formBuilder: FormBuilder,
    private utilService: UtilService) {

    Chart.register(LineController, DoughnutController, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Legend, Filler);

  }
  ngAfterViewInit(): void {
    this.expensesChart = new Chart(this.expensesChartElementRef.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Facturacion mensual(compras)',
            data: []
          },
          {
            label: 'Declaraciones mensuales(ventas)',
            data: []
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
            labels: {
              //color: 'rgb(218, 60, 58)'
            }
          }
        }
      }
    });

    let datas: ChartData<'doughnut'> = {
      labels: [
        'Red',
        'Blue',
        'Yellow'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [1, 1, 1],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    },
      options: {
        cutout: '80%',
        radius: '100%',
        rotation: 0,
        circumference: 360,
        doughnut: {

        };
      };
    this.debtChart = new Chart(this.debtChartElementRef.nativeElement, {
      type: 'doughnut',
      data: datas
    });


  }


  retrieveScore(): void {
    console.log(this.expensesChartElementRef);
    let data: ChartData<'line'> | null = null;
    this.contributorService.queryContributorReport()
      .subscribe({
        next: (response) => {
          console.log(<ContributorDto>response.value);
          this.contributor = <ContributorDto>response.value;
          data = {
            labels: this.contributor.impositionHistoricalRecord
              .map((imposition) => {
                return new Date(imposition.year, imposition.month).toISOString().split("T")[0];
              }),
            datasets: [
              {
                label: 'Facturacion mensual(compras)',
                data: this.contributor.impositionHistoricalRecord
                  .map((imposition) => {
                    return imposition.paymentAmount;
                  }),
                fill: {
                  target: 'origin',
                  above: 'rgb(75,192,192,0.25)',   // Area will be blue above the origin
                  below: 'rgb(75, 192, 192)'    // And blue below the origin
                },
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              },
              {
                label: 'Declaraciones mensuales(ventas)',
                data: this.contributor.statementHistoricalRecord
                  .map((statement) => {
                    return statement.statementAmount;
                  }),
                fill: {
                  target: 'origin',
                  above: 'rgb(218, 60, 58,0.25)',   // Area will be blue above the origin
                  below: 'rgb(75, 192, 192)'    // And blue below the origin
                },
                borderColor: 'rgb(218, 60, 58)',
                tension: 0.1
              }
            ]
          };
        },
        error: (error: HttpErrorResponse): void => {
          console.error(error);
        },
        complete: (): void => {
          this.expensesChart?.destroy();
          this.expensesChart = new Chart(this.expensesChartElementRef.nativeElement, {
            type: 'line',
            data: <ChartData>data,
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    //color: 'rgb(218, 60, 58)'
                  }
                }
              }
            }
          });
          /* this.debtChart?.destroy();
          let doughnutData: ChartData<'doughnut'> = {
            labels: [
              'Deuda tributaria',
              'Deuda bancaria',
              'Deuda privada'
            ],
            datasets: [{
              label: 'Deuda',
              data: [this.contributor!.accumulatedDebt, 2500, 1000],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          },
            options: {
              cutout: '80%',
              radius: '100%',
              rotation: 0,
              circumference: 360,
              doughnut: {

              };
            };
          this.debtChart = new Chart(this.debtChartElementRef.nativeElement, {
            type: 'doughnut',
            data: doughnutData
          }); */

          //Se limitan las fechas que se pueden seleccionar, desde el día actual
          const minYear: number = new Date(<number>this.contributor?.impositionHistoricalRecord[0].year, 1, 1).getFullYear();
          const minMonth: number = new Date(<Date>this.contributor?.impositionHistoricalRecord[0].paymentDate).getMonth();
          const currentDay: number = new Date().getDate();
          const maxYear: number = new Date(<number>this.contributor?.impositionHistoricalRecord[this.contributor?.impositionHistoricalRecord.length - 1].year, 1, 1).getFullYear();
          //La fecha minima, es un dia despues del día actual
          this.minDate = new Date(minYear, minMonth);
          //La fecha maximas, es 6 meses despues del día actual
          this.maxDate = new Date(maxYear, 1, 1);
        }
      });

    this.eegsaService.getCustomerData()
      .subscribe({
        next: (response: CreditScoreResponse): void => {
          console.log("Datos de eegsa");
          console.log(<PrivateCustomerDto>response.value);
          this.eegsaCustomer = <PrivateCustomerDto>response.value;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        },
        complete: () => {
          this.debtChart?.destroy();
          let doughnutData: ChartData<'doughnut'> = {
            labels: [
              'Deuda tributaria',
              'Deuda bancaria',
              'Deuda privada'
            ],
            datasets: [{
              label: 'Deuda',
              data: [this.contributor!.accumulatedDebt, 10000, this.eegsaCustomer!.accumulatedDebt],
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          },
            options: {
              cutout: '80%',
              radius: '100%',
              rotation: 0,
              circumference: 360,
              doughnut: {

              };
            };
          this.debtChart = new Chart(this.debtChartElementRef.nativeElement, {
            type: 'doughnut',
            data: doughnutData
          });
        }
      });
  }

  filterData() {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    if (startDate && endDate && this.contributor) {
      this.expensesChart?.destroy();
      const data = {
        labels: this.contributor.impositionHistoricalRecord
          .map((imposition) => {
            return new Date(imposition.year, imposition.month).toISOString().split("T")[0];
          }),
        datasets: [
          {
            label: 'Facturacion mensual filtrada',
            data: this.contributor.impositionHistoricalRecord
              .map((imposition) => {
                return imposition.paymentAmount;
              }),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };

      this.expensesChart = new Chart(this.expensesChartElementRef.nativeElement, {
        type: 'line',
        data: data,
        options: {
          plugins: {
            legend: {
              display: true,
              labels: {
                color: 'rgb(255, 99, 132)'
              }
            }
          }
        }
      });

    }
  }


}
