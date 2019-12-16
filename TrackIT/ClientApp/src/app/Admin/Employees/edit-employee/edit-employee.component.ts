import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IUser } from '../../../Cases/_services/cases.service';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthorizeService } from '../../../../api-authorization/authorize.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

    public errorMsg;
    private employeeModel: EmployeeModel = { id: "", firstName: "", lastName: "", isManager: null };
    private id: string;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngOnInit() {
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            this.casesService.getUser(this.id).subscribe(result => {
                this.employeeModel = result;
            }, errors => this.errorMsg = errors);
        });
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    onSubmit(employeeForm) {
        this.casesService.updateEmployee(this.employeeModel).subscribe(result => {
            this.router.navigate(['/view-employees']);
        }, errors => this.errorMsg = errors);
    }
}

interface EmployeeModel {
    id: string;
    firstName: string;
    lastName: string;
    isManager: boolean;
}
