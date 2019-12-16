import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService } from '../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-add-skills',
  templateUrl: './add-skills.component.html',
  styleUrls: ['./add-skills.component.css']
})
export class AddSkillsComponent implements OnInit {

    public errorMsg;
    private skillsModel: SkillsModel = { name: "", type: 1 };
    private id: number;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {}

    onSubmit(caseForm) {
        ; this.casesService.addSkill(this.skillsModel).subscribe(result => {
            this.router.navigate(['/view-skills']);
        }, errors => this.errorMsg = errors);
    }
}

interface SkillsModel {
    //id: number;
    name: string;
    type: number;
}
