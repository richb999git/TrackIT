import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ICases, ISoftwares } from '../../Cases/_services/cases.service';
import { CasesService } from '../../Cases/_services/cases.service';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cases-list-support',
  templateUrl: './cases-list-support.component.html',
  styleUrls: ['./cases-list-support.component.css']
})
export class CasesListSupportComponent implements OnInit {

    //public cases: ICases[];
    public cases: any;
    public caseFilter: any = 1; // 1 = active cases
    public softwareFilter: any = 0; // 0 = all software
    public softwares: ISoftwares[];
    public sortProperty: string = "";
    public sortAsc: boolean = true;
    public typeFilter: any = 0; // 0 = all types
    public userRole: any;

    constructor(private casesService: CasesService, private router: Router, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "white"; //DDFFEF
    }

    ngOnInit() {
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));

        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
            this.softwares.unshift({ id: 0, name: "All Software" });
            console.log(this.softwares);
        }, error => console.error(error));

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    editCase(id) {
        this.router.navigate(['/case-display-support/' + id]);
    }

    chooseCaseFilter(e) {
        console.log(this.caseFilter, this.softwareFilter);
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }

    sortCase(sortProperty) {
        if (sortProperty == this.sortProperty) {
            this.sortAsc = !this.sortAsc;
        }
        this.sortProperty = sortProperty;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }
}
