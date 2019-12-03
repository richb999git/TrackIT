import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUsersPagination } from '../../../Cases/_services/cases.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizeService } from '../../../../api-authorization/authorize.service';

@Component({
  selector: 'app-view-employees',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css']
})
export class ViewEmployeesComponent implements OnInit {

    public errorMsg;
    public usersP: IUsersPagination;
    public userRole: any;

    // pagination sort properties:
    public sortProperty: string = "";
    public sortAsc: boolean = true;
    // pagination properties:
    public pageIndex: any = 1;
    public pagesBefore: Array<number> = [];
    public pagesAfter: Array<number> = [];
    public maxPagesEitherSide: number = 4;

    constructor(private casesService: CasesService, private router: Router, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngOnInit() {
        // add filters later: this.progSkills, this.softwareFilter
        this.casesService.getUsersByRole("employee", this.sortProperty, this.sortAsc, 1).subscribe(result => {
            this.usersP = result;
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    editEmployee(id) {
        console.log(id);
        this.router.navigate(['/edit-employee/' + id]);
    }

    chooseEmployeeFilter(e) {
        // add filters later: this.progSkills, this.softwareFilter
        this.casesService.getUsersByRole("employee", this.sortProperty, this.sortAsc, 1).subscribe(result => {
            this.usersP = result;
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    sortEmployees(sortProperty) {
        if (sortProperty == this.sortProperty) this.sortAsc = !this.sortAsc;
        this.sortProperty = sortProperty;
        // add filters later: this.progSkills, this.softwareFilter
        this.casesService.getUsersByRole("employee", this.sortProperty, this.sortAsc, 1).subscribe(result => {
            this.usersP = result;
            console.log(this.usersP);
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    setPagination() {
        this.pagesBefore = [];
        this.pagesAfter = [];
        for (var i = this.usersP.pageIndex - this.maxPagesEitherSide; i < this.usersP.pageIndex; i++) {
            if (i > 0) this.pagesBefore.push(i);
        }
        for (var i = (this.usersP.pageIndex + 1); i <= this.usersP.totalPages; i++) {
            this.pagesAfter.push(i);
            if (i >= this.usersP.pageIndex + this.maxPagesEitherSide) break;
        }
    }

    pageChangedHandler(page: number) {
        // add filters later: this.progSkills, this.softwareFilter
        this.casesService.getUsersByRole("employee", this.sortProperty, this.sortAsc, page).subscribe(result => {
            this.usersP = result;
            console.log(this.usersP);
            this.pageIndex = this.usersP.pageIndex;
            this.setPagination();
        }, error => console.error(error));
    }

}
