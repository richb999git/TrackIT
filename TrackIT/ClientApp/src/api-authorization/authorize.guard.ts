import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizeService } from './authorize.service';
import { tap, map, catchError, switchMap, take } from 'rxjs/operators';
import { ApplicationPaths, QueryParameterNames } from './api-authorization.constants';
import { UserManager } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeGuard implements CanActivate {

    constructor(private authorize: AuthorizeService, private router: Router) {}

    canActivateOriginal(
        _next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
            return this.authorize.isAuthenticated()
                .pipe(tap(isAuthenticated => this.handleAuthorization(isAuthenticated, state)));
    }

    canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return this.authorize.isAuthenticated()
            .pipe(tap(isAuthenticated => {
                if (isAuthenticated) {
                    // pipe(tap( or subscribe(... unsubscribe ?????? or pipe(take(1))
                    this.authorize.getUser().pipe(take(1)).subscribe(
                        user => {
                            if (_next.data.roles) {
                                // https://stackoverflow.com/questions/16312528/check-if-an-array-contains-any-element-of-another-array-in-javascript/29447130
                                if (!user.role || !(_next.data.roles.some(r => user.role.includes(r)))) { 
                                    alert("Not permitted to use this page");
                                    // need to navigate away and display a no entry page or not navigate away and display a message (link should be hidden)
                                    this.router.navigate(["/"], {
                                        queryParams: {
                                            [QueryParameterNames.ReturnUrl]: state.url
                                        }
                                    });
                                } else {
                                    // User has required role therefore permitted
                                }
                            } else {
                                // if no roles required to get to page then allow (already checked if authenticated)
                            }
                        }).unsubscribe(); // not strictly needed with take(1)
                } else {
                    // not authenticated when not logged in (i.e. not logged in)
                    this.handleAuthorization(false, state);
                }
            }));     
    }


    private handleAuthorization(isAuthenticated: boolean, state: RouterStateSnapshot) {
        if (!isAuthenticated) {
            this.router.navigate(ApplicationPaths.LoginPathComponents, {
                queryParams: {
                    [QueryParameterNames.ReturnUrl]: state.url
                }
            });
        } else {
        }
    }

}
