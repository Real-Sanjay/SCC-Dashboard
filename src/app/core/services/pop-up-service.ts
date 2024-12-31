import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PopUpComponent } from 'src/app/shared/components/pop-up/pop-up.component';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  constructor(private dialog: MatDialog) { }

  confirm(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(PopUpComponent, {
      width: '350px',
      data: { message }
    });

    return dialogRef.afterClosed();
  }
}