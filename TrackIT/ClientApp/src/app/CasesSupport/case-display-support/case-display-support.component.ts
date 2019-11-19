import { Component, OnInit } from '@angular/core';
import { CasesService } from '../../Cases/_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-display-support',
  templateUrl: './case-display-support.component.html',
  styleUrls: ['./case-display-support.component.css']
})
export class CaseDisplaySupportComponent implements OnInit {

    public case: any;
    public id: string;

    constructor(private casesService: CasesService, private _route: ActivatedRoute) {
        // For a static snapshot of the route...
        this.id = _route.snapshot.paramMap.get("id"); // preferred way to get param
    }

    ngOnInit() {
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
            console.log(this.case);
        }, error => console.error(error));
    }

}
