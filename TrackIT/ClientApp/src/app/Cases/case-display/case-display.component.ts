import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, ICases } from '../_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-display',
  templateUrl: './case-display.component.html',
  styleUrls: ['./case-display.component.css']
})
export class CaseDisplayComponent implements OnInit {

    private errorMsg: any;
    private case: ICases;
    private id: string; // case id is actually a number but is returned as a string from the params

    constructor(private casesService: CasesService, private _route: ActivatedRoute, private elementRef: ElementRef) {
        // For a static snapshot of the route...
        this.id = _route.snapshot.paramMap.get("id"); // preferred way to get param
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
        }, errors => this.errorMsg = errors);

    }

}
