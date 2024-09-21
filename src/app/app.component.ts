import { Component } from '@angular/core';
import { ContributorService } from './core/services/contributor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor (private contributorService: ContributorService) {
  }

  retrieveScore(): void {
    this.contributorService.queryContributorReport()
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.error(error);
        }
      });
  }
  title = 'credit-score-public-portal';
}
