import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {HttpRequest,HttpHandler,HttpEvent,HttpInterceptor,HttpResponse,HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  //#region Public Members
  //#endregion

  //#region Constructor & Lifecycle Hooks
  constructor(private spinnerservice: NgxUiLoaderService) { }
  //#endregion

  //#region Public Methods
  /**
   * function which will be called for all http calls
   */
  public intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    //how to update the request Parameters
    const updatedRequest = request.clone({
      headers: request.headers.set("Authorization", "Some-dummyCode")
    });
    //logging the updated Parameters to browser's console
    console.log("Before making api call : ", updatedRequest);
    this.spinnerservice.start();
    return next.handle(request).pipe(
      tap(
        event => {
          //logging the http response to browser's console in case of a success
          if (event instanceof HttpResponse) {
            console.log("api call success :", event);
            this.spinnerservice.stop();
          }
        },
        error => { 
          //logging the http response to browser's console in case of a failuer
          if (event instanceof HttpResponse) {
            console.log("api call error :", event);
            this.spinnerservice.stop();
          }
        }
      )
    );
  }
  //#endregion
}