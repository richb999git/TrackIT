import { Component } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css'] 
})
export class NavMenuComponent {
    public isAuthenticated: Observable<boolean>;
    public userRole: any;

    constructor(private authorize: AuthorizeService) {}

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    ngOnInit() {
        this.isAuthenticated = this.authorize.isAuthenticated();
        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    ngOnDestroy() {
        this.userRole.unsubscribe(); // not sure if this is needed
    }
}
