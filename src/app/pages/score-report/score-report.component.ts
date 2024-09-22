import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import { ContributorDto } from '../../core/models';
import { ContributorService } from '../../core/services/contributor.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-score-report',
  templateUrl: './score-report.component.html',
  styleUrl: './score-report.component.scss'
})
export class ScoreReportComponent {
  filterForm: FormGroup<{
    startDate: FormControl<Date | null>,
    endDate: FormControl<Date | null>,
  }> = this.formBuilder.group({
    startDate: new FormControl<Date | null>(null),
    endDate: new FormControl<Date | null>(null)
  });
  handleFindAvailableDates(event: MatDatepickerInputEvent<Date> | Event | KeyboardEvent) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('myChart') chart!: ElementRef;
  minDate: Date | string = new Date();
  maxDate: Date | string = new Date();
  contributor: ContributorDto | null = null;
  impositionsChart: Chart | null = null;
  constructor (private contributorService: ContributorService, private formBuilder: FormBuilder) {
    Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
  }


  retrieveScore(): void {
    console.log(this.chart);
    this.contributorService.queryContributorReport()
      .subscribe({
        next: (response) => {
          console.log(<ContributorDto>response.value);
          this.contributor = <ContributorDto>response.value;
          const data = {
            labels: this.contributor.impositionHistoricalRecord
              .map((imposition) => {
                return new Date(imposition.year, imposition.month).toISOString().split("T")[0];
              }),
            datasets: [
              {
                label: 'Facturacion mensual',
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

          this.impositionsChart = new Chart(this.chart.nativeElement, {
            type: 'line',
            data: data
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      });
  }

  filterData() {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;
    if (startDate && endDate && this.contributor) {
      this.impositionsChart?.destroy();
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

      this.impositionsChart = new Chart(this.chart.nativeElement, {
        type: 'line',
        data: data
      });

    }
  }


}
