import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICases } from '../../Cases/_services/cases.service';
import { CasesService } from '../../Cases/_services/cases.service';

@Component({
  selector: 'app-cases-list-support',
  templateUrl: './cases-list-support.component.html',
  styleUrls: ['./cases-list-support.component.css']
})
export class CasesListSupportComponent implements OnInit {

    //public cases: ICases[];
    public cases: any;

    constructor(private casesService: CasesService, private router: Router) { }

    ngOnInit() {
        this.casesService.getCasesSupport().subscribe(result => {
            this.cases = result;
            console.log(this.cases);
        }, error => console.error(error));
    }

    editCase(id) {
        this.router.navigate(['/case-display-support/' + id]);
    }
}
