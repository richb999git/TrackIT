import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUser, IEmployeeSkills } from '../../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizeService } from '../../../../../api-authorization/authorize.service';
declare var $: any;

@Component({
  selector: 'app-view-skills-of-employee',
  templateUrl: './view-skills-of-employee.component.html',
  styleUrls: ['./view-skills-of-employee.component.css']
})
export class ViewSkillsOfEmployeeComponent implements OnInit {

    public errorMsg;
    private employeeSkills: Array<IEmployeeSkills>;
    private userId: string;
    private user: IUser;
    private deleteId: number;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngOnInit() {
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.userId = params.get('id');
            console.log(this.userId);
            this.casesService.getAllEmployeeSkills(this.userId).subscribe(result => {
                console.log(result);
                this.employeeSkills = result;
            }, errors => this.errorMsg = errors);
            this.casesService.getUser(this.userId).subscribe(result => {
                this.user = result;
            }, errors => this.errorMsg = errors);
        });
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    editSkill(id) {
        console.log(id);
        this.router.navigate(['/edit-employee-skills/' + id]);
    }

    deleteSkill(id) {
        this.deleteId = id;
        $('#myModal').modal('show');
    }

    confirmDeleteSkill(e) {
        this.casesService.deleteSkillOfEmployee(this.deleteId).subscribe(result => {
            this.employeeSkills = this.employeeSkills.filter(x => x.id != this.deleteId);
        }, errors => this.errorMsg = errors);
    }

}

