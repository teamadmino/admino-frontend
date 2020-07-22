import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { filter, take, switchMap } from "rxjs/operators";
import { AdminoUserService } from "../services/user.service";

@Injectable()
export class AdminoPostCacheInterceptor implements HttpInterceptor {
  constructor(private user: AdminoUserService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    return next.handle(req).pipe(
      tap((response) => {
        console.log(response);
      }),
      catchError((error, caught) => {
        return throwError(error);
      })
    );
    // let token: string;
    // token = this.user.sid;
    // if (!token) {
    //     const body = Object.assign({}, req.body);
    //     body.sid = 'null';
    //     const copiedReq1 = req.clone({ body: JSON.stringify(body) });
    //     return next.handle(copiedReq1);
    // } else {
    //     const body = Object.assign({}, req.body);
    //     body.sid = token;
    //     const copiedReq = req.clone({ body: JSON.stringify(body) });
    //     return next.handle(copiedReq);
    // }
  }
}
