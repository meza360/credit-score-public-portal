import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-letter',
  templateUrl: './credit-letter.component.html',
  styleUrl: './credit-letter.component.scss'
})
export class CreditLetterComponent implements AfterViewInit, OnInit {
  @Input() letter!: string;
  scoreRepresentation: string = '';
  constructor () {

  }
  ngOnInit(): void {
    console.debug(this.letter);
    switch (this.letter) {
      case 'A':
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-a.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
      case 'B':
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-b.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
      case 'C':
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-c.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
      case 'D':
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-d.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
      case 'E':
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-e.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
      default:
        this.scoreRepresentation = 'https://gateway-01.api.gt2software.dev/ecommerce/public/credit-score-portal/svg/letter-e.svg?freseria-client-key=b50a6bbcc54e41af80afc26d260394eb';
        break;
    }
  }
  ngAfterViewInit(): void {

  }
}
