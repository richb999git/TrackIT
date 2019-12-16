import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares, ICases } from '../_services/cases.service';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html',
  styleUrls: ['./case-add.component.css']
})
export class CaseAddComponent implements OnInit {

    private caseModel: CaseModel = { title: "", description: "", urgencyLevel: 3, softwareId: 2, type: 1 };
    private errorMsg;

    public types = [{ title: "Bug", value: 1 },
                    { title: "Question", value: 2 },
                    { title: "Issue", value: 3 },
                    { title: "Feature Request", value: 4 }];

    private softwareIds: Array<ISoftwares>;
    
    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwareIds = result;
        }, errors => this.errorMsg = errors);
    }

    onSubmit(caseForm) {
        this.casesService.addCase(this.caseModel).subscribe(result => {
            this.router.navigate(['/cases-list']);
        }, errors => this.errorMsg = errors);
    }

}

interface CaseModel {
    //id: number;
    title: string;
    description: string;
    urgencyLevel: number;
    softwareId: number;
    type: number;
}
