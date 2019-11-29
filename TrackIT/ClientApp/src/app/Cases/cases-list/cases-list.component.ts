import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ICases, ISoftwares } from '../_services/cases.service';
import { CasesService } from '../_services/cases.service';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.css']
})
export class CasesListComponent implements OnInit {

    public cases: ICases[];
    public cases2: any;
    public caseFilter: any = 1; // 1 = active cases
    public softwareFilter: any = 0; // 0 = all software
    public softwares: ISoftwares[];
    public sortProperty: string = "";
    public sortAsc: boolean = true;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));

        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
            this.softwares.unshift({ id: 0, name: "All Software" });
            console.log(this.softwares);
        }, error => console.error(error));
    }

    editCase(id) {
        this.router.navigate(['/case-display/' + id]);
    }

    chooseCaseFilter(e) {
        // go to back end and fetch cases
        console.log("dropdown choice:" + e);
        console.log(this.caseFilter);
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }


    sortCase(sortProperty) {
        console.log("Sort by: " + sortProperty);
        if (sortProperty == this.sortProperty) {
            this.sortAsc = !this.sortAsc;
            console.log("SortAsc: " + this.sortAsc);
        }
        this.sortProperty = sortProperty;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }
}
