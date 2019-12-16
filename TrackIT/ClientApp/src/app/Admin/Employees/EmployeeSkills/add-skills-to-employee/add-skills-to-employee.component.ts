import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUser, ISkills } from '../../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizeService } from '../../../../../api-authorization/authorize.service';

@Component({
  selector: 'app-add-skills-to-employee',
  templateUrl: './add-skills-to-employee.component.html',
  styleUrls: ['./add-skills-to-employee.component.css']
})
export class AddSkillsToEmployeeComponent implements OnInit {

    public errorMsg;
    private employeeSkillsModel: EmployeeSkillsModel = { skillsId: null, userId: null, experience: 3 };
    private userId: string;
    private user: IUser;
    private skills: Array<ISkills>;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.userId = params.get('id');
            this.casesService.getUser(this.userId).subscribe(result => {
                this.user = result;
            }, errors => this.errorMsg = errors);
        });

        this.casesService.getSkills("id", true).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);
        
    }

    onSubmit(form) {
        this.employeeSkillsModel.userId = this.userId;
        this.casesService.addSkillToEmployee(this.employeeSkillsModel).subscribe(result => {
            this.router.navigate(['/view-employee-skills/' + this.userId]);
        }, errors => this.errorMsg = errors);
    }

}

interface EmployeeSkillsModel {
    //id: number;
    skillsId: number;
    userId: string;
    experience: number;
}
