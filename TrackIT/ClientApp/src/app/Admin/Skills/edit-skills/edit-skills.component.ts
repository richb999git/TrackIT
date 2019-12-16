import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService } from '../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-skills',
  templateUrl: './edit-skills.component.html',
  styleUrls: ['./edit-skills.component.css']
})
export class EditSkillsComponent implements OnInit {

    public errorMsg;
    private skillsModel: SkillsModel = { id: 0, name: "", type: null };
    private id: number;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        // For subscribing to the observable paramMap...
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.id = parseInt(params.get('id'));
            this.casesService.getSkill(this.id).subscribe(result => {
                this.skillsModel = result;
            }, errors => this.errorMsg = errors);
        });
    }

    onSubmit(caseForm) {
;        this.casesService.updateSkill(this.skillsModel).subscribe(result => {
            this.router.navigate(['/view-skills']);
        }, errors => this.errorMsg = errors);
    }
}

interface SkillsModel {
    id: number;
    name: string;
    type: number;
}

