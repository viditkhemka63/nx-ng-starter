import { Inject, Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';

import { IWebsocketConfig, IWebsocketRequestEvent, IWebsocketResponseEvent, WS_CONFIG } from '../websocket.interface';

/**
 * Websocket API Service.
 */
@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class AppWebsocketApiService {
  private readonly websocketSubject$: WebSocketSubject<IWebsocketRequestEvent> = new WebSocketSubject(this.wsConfig);

  constructor(@Inject(WS_CONFIG) private readonly wsConfig: IWebsocketConfig) {}

  public connect() {
    return this.websocketSubject$.pipe(
      untilDestroyed(this),
      catchError((error: Event, caught: Observable<IWebsocketRequestEvent>) => {
        // eslint-disable-next-line no-console -- this is needed so that websocket erros are reported to console
        console.error('error', error);
        return of(null);
      }),
    ) as Observable<IWebsocketResponseEvent<number>>;
  }

  public sendEvent(eventType: 'events') {
    const event = { event: eventType };
    this.websocketSubject$.next(event);
  }
}
