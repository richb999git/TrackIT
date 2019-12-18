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

    private errorMsg: any;
    private cases: ICasesPagination;
    private softwares: ISoftwares[];

    // pagination sort/filter/search properties:
    private caseFilter: number = 1; // 1 = active cases
    private softwareFilter: number = 0; // 0 = all software
    private sortProperty: string = "";
    private sortAsc: boolean = true;
    private searchModel: searchModel = { searchString: "" };
    // pagination properties:
    private pageIndex: number = 1;
    private pagesBefore: Array<number> = [];
    private pagesAfter: Array<number> = [];
    private maxPagesEitherSide: number = 4;


    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.caseFilter = this.casesService.getCaseFilterUser();
        this.softwareFilter = this.casesService.getSoftwareFilterUser();
        this.sortProperty = this.casesService.getSortPropertyUser();
        this.sortAsc = this.casesService.getSortAscUser();
        this.pageIndex = this.casesService.getPageIndexUser();
        this.searchModel.searchString = this.casesService.getSearchStringUser();
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.setPagination();
        }, errors => this.errorMsg = errors);

        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
            this.softwares.unshift({ id: 0, name: "All Software" });
        }, errors => this.errorMsg = errors);
    }


    editCase(id) {
        this.casesService.setFiltersUser(this.caseFilter, this.softwareFilter, 0, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        this.router.navigate(['/case-display/' + id]);
    }

    chooseCaseFilter(e) {
        if (this.searchModel.searchString == null) this.searchModel.searchString = "";
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFiltersUser(this.caseFilter, this.softwareFilter, 0, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }


    sortCase(sortProperty) {
        this.sortAsc = sortProperty == this.sortProperty ? !this.sortAsc : true;
        this.sortProperty = sortProperty;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFiltersUser(this.caseFilter, this.softwareFilter, 0, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

    onKeySearch(form) {
        this.searchModel.searchString = form.controls.searchString.value == null ? "" : form.controls.searchString.value;
        this.casesService.getCases(this.caseFilter, this.softwareFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFiltersUser(this.caseFilter, this.softwareFilter, 0, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
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
            this.pageIndex = this.cases.pageIndex;
            this.setPagination();
            this.casesService.setFiltersUser(this.caseFilter, this.softwareFilter, 0, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

}

interface searchModel {
    searchString: string;
}
