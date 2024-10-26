import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Filler,
  LegendElement,
  Legend,
  ChartData,
  ChartType,
  DoughnutController,
  DoughnutControllerChartOptions,
  ArcElement
} from 'chart.js';
import { BankCustomer, ContributorDto, CreditScoreResponse, Entity, PrivateCustomerDto } from '../../core/models';
import { ContributorService } from '../../core/services/contributor.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UtilService } from '../../core/services/util.service';
import { EEGSAService } from '../../core/services/private/eegsa.service';
import { BancoUnionService } from '../../core/services/bank/banco-union.service';
import { ActivatedRoute, Params } from '@angular/router';
import { LoadingDialogComponent } from '../../components/loading-dialog/loading-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EntityService } from '../../core/services/entity.service';

@Component({
  selector: 'app-score-report',
  templateUrl: './score-report.component.html',
  styleUrl: './score-report.component.scss'
})
export class ScoreReportComponent implements OnInit, AfterViewInit {
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
  bancoUnionCustomer: BankCustomer | null = null;
  currentCitizenCui: string | null = null;
  expensesChart: Chart | null = null;
  debtChart: Chart | null = null;
  currentEntity: Entity | null = null;
  noCompliance: string = '';
  tributaryNoCompliance: string = '';
  privateNoCompliance: string = '';
  dialogref: MatDialogRef<LoadingDialogComponent> | null = null;
  constructor (
    private contributorService: ContributorService,
    private eegsaService: EEGSAService,
    private formBuilder: FormBuilder,
    private bancoUnionService: BancoUnionService,
    private route: ActivatedRoute,
    private matDialog: MatDialog,
    private entityService: EntityService,
    private utilService: UtilService) {

    Chart.register(
      LineController,
      DoughnutController,
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      ArcElement,
      Legend,
      Filler);
  }
  openLoadingDialog(): void {
    this.dialogref = this.matDialog.open(LoadingDialogComponent,
      {
        width: '70%',
        data: "",
        disableClose: true
      });
  }
  closeLoadingDialog(): void {
    this.dialogref?.close();
  }
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params: Params): void => {
        console.debug('Ruta a buscar: ', params['id']);
        if (params['id'] != null) {
          this.currentCitizenCui = params['id'];
          // Si hay algun cui en la ruta, se buscan los datos de ese cliente
          this.openLoadingDialog();
          this.retrieveScore();
        };
      }
    });
  }
  ngAfterViewInit(): void {
    if (!this.currentCitizenCui) {
      this.initializeExpensesChart();
      this.initializeDebtChart();
    }
  }
  initializeExpensesChart(): void {
    this.expensesChart = new Chart(this.expensesChartElementRef.nativeElement, {
      type: 'line',
      data: {
        labels: ['El cliente no tiene datos de facturas o declaraciones juradas'],
        datasets: [
          {
            label: 'No hay datos tributarios para mostrar',
            data: []
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true
          }
        }
      }
    });
  }
  initializeDebtChart(): void {
    let datas: ChartData<'doughnut'> = {
      labels: [
        'Deuda acumulada'
      ],
      datasets: [{
        label: 'Datos',
        data: [1],
        backgroundColor: [
          '#930011'
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

  getContributorTributaryDataStep1(): void {
    let data: ChartData<'line'> | null = null;
    this.contributorService.queryContributorReport(this.currentCitizenCui!)
      .subscribe({
        next: (response: { chartData: ChartData<'line'> | null, contributor: ContributorDto; } | null): void => {
          console.log("Datos tributarios", response);
          if (!response) {
            return;
          }
          this.contributor = response.contributor;
          data = response.chartData;
        },
        error: (error: HttpErrorResponse): void => {
          console.error(error);
        },
        complete: (): void => {
          this.expensesChart?.destroy();
          if (data) {
            this.expensesChart = new Chart(this.expensesChartElementRef.nativeElement, {
              type: 'line',
              data: <ChartData>data,
              options: {
                plugins: {
                  legend: {
                    display: true,
                    labels: {
                      color: 'rgb(255, 218, 214)'
                    }
                  }
                }
              }
            });
          }
          else {
            this.initializeExpensesChart();
          }

          //Se limitan las fechas que se pueden seleccionar, desde el día actual
          const minYear: number = this.contributor!.impositionHistoricalRecord.length > 0 ? new Date(<number>this.contributor?.impositionHistoricalRecord[0].year, 1, 1).getFullYear() : new Date().getFullYear();
          const minMonth: number = this.contributor!.impositionHistoricalRecord.length > 0 ? new Date(<Date>this.contributor?.impositionHistoricalRecord[0].paymentDate).getMonth() : new Date().getMonth();
          const currentDay: number = new Date().getDate();
          const maxYear: number = this.contributor!.impositionHistoricalRecord.length > 0 ? new Date(<number>this.contributor?.impositionHistoricalRecord[this.contributor?.impositionHistoricalRecord.length - 1].year, 1, 1).getFullYear() : new Date().getFullYear();
          //La fecha minima, es un dia despues del día actual
          this.minDate = new Date(minYear, minMonth);
          //La fecha maximas, es 6 meses despues del día actual
          this.maxDate = new Date(maxYear, 1, 1);
          let tributary = this.contributor?.statementHistoricalRecord.find((imposition) => imposition.wasDue);
          this.tributaryNoCompliance = tributary?.wasDue ? 'Declaraciones vencidas' : 'Sin incumplimientos';
          this.getEEGSACustomerDataStep2();
        }
      });
  }

  getEEGSACustomerDataStep2(): void {
    this.eegsaService.getCustomerData(this.currentCitizenCui!)
      .subscribe({
        next: (response: PrivateCustomerDto | null): void => {
          console.log("Datos de eegsa: ", response);
          if (!response) {
            return;
          }
          this.eegsaCustomer = response;
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
        },
        complete: (): void => {
          let privateC = this.eegsaCustomer?.historicalRecord.find(bill => bill.wasDue);
          this.privateNoCompliance = privateC?.wasDue ? 'Facturas vencidas' : 'Sin incumplimientos';
          this.getBankDebtDataStep3();
        }
      });
  }

  getBankDebtDataStep3(): void {
    this.bancoUnionService.getCustomerData(this.currentCitizenCui!)
      .subscribe(
        {
          next: (response: BankCustomer | null): void => {
            console.log("Datos de banco union", response);
            if (!response) { return; }
            this.bancoUnionCustomer = response;
          },
          error: (err: HttpErrorResponse): void => { },
          complete: (): void => {
            let loan = this.bancoUnionCustomer?.loanHistoricalRecord.find((history) => history.wasDue);
            let credit = this.bancoUnionCustomer?.creditHistoricalRecord.find((history) => history.wasDue);
            this.noCompliance = loan?.wasDue ? 'Cuotas de préstamo' : credit?.wasDue ? 'Cuotas de tarjeta de crédito' : credit?.wasDue && loan?.wasDue ? 'Incumplimiento de pagos de prestamos y creditos' : 'Sin incumplimientos';
            this.fillDoughnutData();
            this.retrieveConsolidatedScoreStep4();
            //this.closeLoadingDialog();
          }
        });
  }

  retrieveConsolidatedScoreStep4(): void {
    this.entityService.getEntityReport(this.currentCitizenCui!)
      .subscribe({
        next: (response: Entity | null): void => {
          console.log("Datos consolidados: ", response);
          if (!response) { return; }
          this.currentEntity = response;
        },
        error: (err: HttpErrorResponse): void => {
          console.error(err);
        },
        complete: (): void => {
          this.closeLoadingDialog();
        },
      });
  }
  retrieveScore(): void {
    this.getContributorTributaryDataStep1();
  }

  fillDoughnutData(): void {
    this.debtChart?.destroy();
    let doughnutData: ChartData<'doughnut'> = {
      labels: [
        'Deuda tributaria',
        'Deuda bancaria',
        'Deuda privada'
      ],
      datasets: [{
        label: 'Deuda',
        data: [this.contributor?.accumulatedDebt ?? 0, this.bancoUnionCustomer?.accumulatedDebt ?? 0, this.eegsaCustomer?.accumulatedDebt ?? 0],
        backgroundColor: [
          '#930011',
          '#DA3C3A',
          '#F9B6B0',
          '#F9B6B0'
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

        },
        plugins: {
          customCanvasBackgroundColor: {
            //color: '#FF0000';
          };
        };
      };
    this.debtChart = new Chart(this.debtChartElementRef.nativeElement, {
      type: 'doughnut',
      data: doughnutData
    });
  }
  filterData(): void {
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
