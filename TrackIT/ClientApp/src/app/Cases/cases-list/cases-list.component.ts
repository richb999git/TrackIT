import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ICases, ISoftwares, ICasesPagination } from '../_services/cases.service';
import { CasesService } from '../_services/cases.service';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.css']
})
export class CasesListComponent implements OnInit {

    public cases: ICasesPagination;
    public softwares: ISoftwares[];

    // pagination sort/filter/search properties:
    public caseFilter: any = 1; // 1 = active cases
    public softwareFilter: any = 0; // 0 = all software
    public sortProperty: string = "";
    public sortAsc: boolean = true;
    public searchModel: searchModel = { searchString: "" };
    // pagination properties:
    public pageIndex: any = 1;
    public pagesBefore: Array<number> = [];
    public pagesAfter: Array<number> = [];
    public maxPagesEitherSide: number = 4;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.pageIndex = 1;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, "").subscribe(result => {
            this.cases = result;
            console.log(result);
            this.setPagination();
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
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }


    sortCase(sortProperty) {
        if (sortProperty == this.sortProperty) this.sortAsc = !this.sortAsc;
        this.sortProperty = sortProperty;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    onKeySearch(form) {
        this.searchModel.searchString = form.controls.searchString.value == null ? "" : form.controls.searchString.value;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    setPagination() {
        this.pagesBefore = [];
        this.pagesAfter = [];
        for (var i = this.cases.pageIndex - this.maxPagesEitherSide; i < this.cases.pageIndex; i++) {
            if (i > 0) this.pagesBefore.push(i);
        }
        for (var i = (this.cases.pageIndex + 1); i <= this.cases.totalPages; i++) {
            this.pagesAfter.push(i);
            if (i >= this.cases.pageIndex + this.maxPagesEitherSide) break;
        }
    }

    pageChangedHandler(page: number) {
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, page, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
            this.pageIndex = this.cases.pageIndex;
            this.setPagination();
        }, error => console.error(error));
    }
}

interface searchModel {
    searchString: string;
}
