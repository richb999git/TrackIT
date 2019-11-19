import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICases } from '../_services/cases.service';
import { CasesService } from '../_services/cases.service';

@Component({
  selector: 'app-cases-list',
  templateUrl: './cases-list.component.html',
  styleUrls: ['./cases-list.component.css']
})
export class CasesListComponent implements OnInit {

    public cases: ICases[];
    public cases2: any;

    constructor(private casesService: CasesService, private router: Router) { }

    ngOnInit() {
        this.casesService.getCases().subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }

    editCase(id) {
        this.router.navigate(['/case-display/' + id]);
    }
}
