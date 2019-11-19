import { Component, OnInit } from '@angular/core';
import { CasesService } from '../_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-display',
  templateUrl: './case-display.component.html',
  styleUrls: ['./case-display.component.css']
})
export class CaseDisplayComponent implements OnInit {
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
            //console.log(this.cases[0].userId);
        }, error => console.error(error));
    }

}
