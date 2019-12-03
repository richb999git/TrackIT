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
    
    public cases: ICasesPagination; //any;
    public userRole: any;
    public softwares: ISoftwares[];

    // pagination sort/filter/search properties:
    public caseFilter: any = 1; // 1 = active cases
    public softwareFilter: any = 0; // 0 = all software
    public typeFilter: any = 0; // 0 = all types
    public sortProperty: string = "";
    public sortAsc: boolean = true;
    public searchModel: searchModel = { searchString: "" };
    public searchString: string = "";
    // pagination properties:
    public pageIndex: any = 1;
    public pagesBefore: Array<number> = [];
    public pagesAfter: Array<number> = [];
    public maxPagesEitherSide: number = 4;

    constructor(private casesService: CasesService, private router: Router, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "white"; //DDFFEF
    }

    ngOnInit() {
        this.pageIndex = 1;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, "").subscribe(result => {
            console.log(result);
            this.cases = result;
            this.setPagination();
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
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    sortCase(sortProperty) {
        if (sortProperty == this.sortProperty) {
            this.sortAsc = !this.sortAsc;
        }
        this.sortProperty = sortProperty;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
            this.cases = result;
            console.log(this.cases);
            this.pageIndex = 1;
            this.setPagination();
        }, error => console.error(error));
    }

    onSubmitSearch(form) {
        this.searchModel.searchString = form.value.searchString;
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, 1, this.searchModel.searchString).subscribe(result => {
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
        for (var i = (this.cases.pageIndex + 1) ; i <= this.cases.totalPages; i++) {
            this.pagesAfter.push(i);
            if (i >= this.cases.pageIndex + this.maxPagesEitherSide) break;
        }
    }

    pageChangedHandler(page: number) {
        this.casesService.getCasesSupport(this.caseFilter, this.softwareFilter, this.typeFilter, this.sortProperty, this.sortAsc, page, this.searchModel.searchString).subscribe(result => {
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
