import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ISoftwares, ICasesPagination} from '../../Cases/_services/cases.service';
import { CasesService } from '../../Cases/_services/cases.service';
import { AuthorizeService } from '../../../api-authorization/authorize.service';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-cases-list-support',
  templateUrl: './cases-list-support.component.html',
  styleUrls: ['./cases-list-support.component.css']
})
export class CasesListSupportComponent implements OnInit {

    private errorMsg: any;
    private cases: ICasesPagination; 
    private userRole: any;
    private softwares: ISoftwares[];

    // pagination sort/filter/search properties:
    private caseFilter: number = 1; // 1 = active cases
    private softwareFilter: number = 0; // 0 = all software
    private typeFilter: number = 0; // 0 = all types
    private sortProperty: string = "";
    private sortAsc: boolean = true;
    private searchModel: searchModel = { searchString: "" };
    private searchString: string = "";
    // pagination properties:
    private pageIndex: number = 1;
    private pagesBefore: Array<number> = [];
    private pagesAfter: Array<number> = [];
    private maxPagesEitherSide: number = 4;

    constructor(private casesService: CasesService, private router: Router, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.caseFilter = this.casesService.getCaseFilter();
        this.softwareFilter = this.casesService.getSoftwareFilter();
        this.typeFilter = this.casesService.getTypeFilter();
        this.sortProperty = this.casesService.getSortProperty();
        this.sortAsc = this.casesService.getSortAsc();
        this.pageIndex = this.casesService.getPageIndex();
        this.searchModel.searchString = this.casesService.getSearchString();

        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString).subscribe(result => {                                     
            this.cases = result;
            this.setPagination();
        }, errors => this.errorMsg = errors);

        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
            this.softwares.unshift({ id: 0, name: "All Software" });
        }, errors => this.errorMsg = errors);

        this.userRole = this.authorize.getUser().pipe(map(u => u && u.role));
    }

    editCase(id) {
        this.casesService.setFilters(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        this.router.navigate(['/case-display-support/' + id]);
    }

    chooseCaseFilter(e) {
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFilters(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

    sortCase(sortProperty) {
        this.sortAsc = sortProperty == this.sortProperty ? !this.sortAsc : true;
        this.sortProperty = sortProperty;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFilters(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

    onSubmitSearch(form) {
        this.searchModel.searchString = form.value.searchString;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = 1;
            this.setPagination();
            this.casesService.setFilters(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

    setPagination() {
        this.pagesBefore = [];
        this.pagesAfter = [];
        for (var i = this.cases.pageIndex - this.maxPagesEitherSide; i < this.cases.pageIndex; i++) {
            if (i > 0) this.pagesBefore.push(i);
        }
        for (var i = (this.cases.pageIndex + 1) ; i <= this.cases.totalPages; i++) {
            this.pagesAfter.push(i);
            if (i >= this.cases.pageIndex + this.maxPagesEitherSide) break;
        }
    }

    pageChangedHandler(page: number) {
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, page, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            this.pageIndex = this.cases.pageIndex;
            this.setPagination();
            this.casesService.setFilters(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, this.pageIndex, this.searchModel.searchString);
        }, errors => this.errorMsg = errors);
    }

}

interface searchModel {
    searchString: string;
}
