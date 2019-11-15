import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../authorize.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import "jquery";    // added to get ability to use dropdown nav menu
import "bootstrap"; // added to get ability to use dropdown nav menu

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {
    public isAuthenticated: Observable<boolean>;
    public userName: Observable<string>;
    public userRole: any;

    constructor(private authorizeService: AuthorizeService) { }

    ngOnInit() {
        this.isAuthenticated = this.authorizeService.isAuthenticated();
        this.userName = this.authorizeService.getUser().pipe(map(u => u && u.name));
        this.userRole = this.authorizeService.getUser().pipe(map(u => u && u.role));
    }

    ngOnDestroy() {
        this.userRole.unsubscribe(); // not sure if this is needed
    }
}
