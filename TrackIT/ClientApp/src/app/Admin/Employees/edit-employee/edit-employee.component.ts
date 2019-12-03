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

    private employeeModel: EmployeeModel = { id: "", firstName: "", lastName: "", isManager: null };
    private id: string;
    public errorMsg;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private authorize: AuthorizeService, private elementRef: ElementRef) { }

    ngOnInit() {
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.id = params.get('id');
            console.log(this.id);
            this.casesService.getUser(this.id).subscribe(result => {
                console.log(result);
                this.employeeModel = result;
            }, error => console.error(error));
        });
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    onSubmit(employeeForm) {
        console.log(this.employeeModel);
        this.casesService.updateEmployee(this.employeeModel).subscribe(result => {
            this.router.navigate(['/view-employees']);
        }, errors => {
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors;
            } else {
                this.errorMsg = "Server error";
            }
        });
    }
}

//interface EmployeeModel {
//    id: string;
//    firstName: string;
//    lastName: string;
//}

interface EmployeeModel {
    id: string;
    firstName: string;
    lastName: string;
    isManager: boolean;
}
