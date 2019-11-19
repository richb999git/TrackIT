import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService } from '../_services/cases.service';

@Component({
  selector: 'app-case-add',
  templateUrl: './case-add.component.html',
  styleUrls: ['./case-add.component.css']
})
export class CaseAddComponent implements OnInit {

    private caseModel: CaseModel = { title: "", description: "", urgencyLevel: 3, softwareId: 2, type: 1 };
    public errorMsg;

    public types = [{ title: "Bug", value: 1 },
                    { title: "Question", value: 2 },
                    { title: "Issue", value: 3 },
                    { title: "Feature Request", value: 4 }];

    public softwareIds;
    
    constructor(private casesService: CasesService, private router: Router) { }

    ngOnInit() {
        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwareIds = result;
        }, error => console.error(error));
    }

    onSubmit(caseForm) {
        console.log(caseForm);
        console.log(this.caseModel);
        //this.caseModel.urgencyLevel = +this.caseModel.urgencyLevel;
        this.casesService.addCase(this.caseModel).subscribe(result => {
            console.log(result);
            this.router.navigate(['/cases-list']);
        }, errors => {
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors;
            } else {
                this.errorMsg = "Server error";
            }
        });
    }

    changeType(e) {
        console.log("changeType selected");
        console.log(e);
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
