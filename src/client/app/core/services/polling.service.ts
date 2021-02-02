import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, delay, expand, filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

const CONNECTION_CHECK_DELAY = 5000;

@Injectable({
  providedIn: 'root'
})
export class PollingService {

  constructor(protected http: HttpClient) {
  }

  public isReadyToUpdate$(url: string): Observable<boolean> {
    return this.isConnectionOk$(url).pipe(
      expand(ok => ok ? EMPTY : this.isConnectionOk$(url, CONNECTION_CHECK_DELAY)),
      filter(ok => ok)
    );
  }

  public isConnectionOk$(url: string, delayTime = 0): Observable<boolean> {
    return this.http.options(url, {observe: 'response'})
      .pipe(
        map(res => res.ok),
        catchError(() => of(false)),
        delay(delayTime)
      );
  }
}
