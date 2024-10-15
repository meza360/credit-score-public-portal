import { NgModule } from "@angular/core";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatNativeDateModule
} from '@angular/material/core';
import {
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
    MatMomentDateModule,
    MomentDateAdapter
} from '@angular/material-moment-adapter';
import {
    MAT_SNACK_BAR_DEFAULT_OPTIONS,
    MatSnackBarModule
} from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'YYYY/MM/DD',
    },
    display: {
        dateInput: 'YYYY/MM/DD',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
    imports: [
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule
    ],
    exports: [
        MatFormFieldModule,
        MatDatepickerModule,
        ReactiveFormsModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatProgressBarModule
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: MY_DATE_FORMAT
        },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
                floatLabel: 'always'
            }
        },
        {
            provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
            useValue: {
                duration: 10000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom'
            }
        }
    ]
})
export class MaterialModule { }