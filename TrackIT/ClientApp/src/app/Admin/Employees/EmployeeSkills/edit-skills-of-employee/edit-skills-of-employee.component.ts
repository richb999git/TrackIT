import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUser, ISkills } from '../../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizeService } from '../../../../../api-authorization/authorize.service';

@Component({
  selector: 'app-edit-skills-of-employee',
  templateUrl: './edit-skills-of-employee.component.html',
  styleUrls: ['./edit-skills-of-employee.component.css']
})
export class EditSkillsOfEmployeeComponent implements OnInit {

    public errorMsg;
    private employeeSkillsModel: EmployeeSkillsModel = { id: null, skillsId: null, user: null, userId: null, experience: null };
    private id: number;
    private skills: Array<ISkills>;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.id = parseInt(params.get('id'));
            // get particular skill of employee to be edited
            this.casesService.getEmployeeSkill(this.id).subscribe(result => {
                this.employeeSkillsModel = result;
            }, errors => this.errorMsg = errors);
        });

        this.casesService.getSkills("id", true).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);
    }

    onSubmit(form) {
        this.casesService.updateSkillOfEmployee(this.employeeSkillsModel).subscribe(result => {
            this.router.navigate(['/view-employee-skills/' + this.employeeSkillsModel.userId]);
        }, errors => this.errorMsg = errors);
    }

}

interface EmployeeSkillsModel {
    id: number;
    skillsId: number;
    userId: string;
    user: IUser;
    experience: number;
}
