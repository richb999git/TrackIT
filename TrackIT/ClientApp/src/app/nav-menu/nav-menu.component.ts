import { Component } from '@angular/core';
import { AuthorizeService } from 'src/api-authorization/authorize.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
//import "jquery";    // added to get ability to use dropdown nav menu - see angular.json because added there
//import "bootstrap"; // added to get ability to use dropdown nav menu - see angular.json because added there
declare var $: any;

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
        //this.isExpanded = !this.isExpanded; // function below used instead to avoid the navbar disappearing immediately when mobile menu first clicked
    }

    ngOnInit() {
        this.isAuthenticated = this.authorize.isAuthenticated();
        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));

        $(document).ready(function () {
            $(document).on('click', '.navbar-toggler', function (e) {
                $(".navbar-collapse").collapse('toggle');
            })
        });
   
    }

    ngOnDestroy() {
        this.userRole.unsubscribe(); // not sure if this is needed
    }
}
