import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares } from '../../../Cases/_services/cases.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-edit-software',
  templateUrl: './edit-software.component.html',
  styleUrls: ['./edit-software.component.css']
})
export class EditSoftwareComponent implements OnInit {

    private softwareModel: SoftwareModel = { id: 0, name: "" };
    private id: number;
    public errorMsg;

    constructor(private casesService: CasesService, private router: Router, private _route: ActivatedRoute, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        // For subscribing to the observable paramMap...
        this._route.paramMap.subscribe((params: ParamMap) => {
            this.id = parseInt(params.get('id'));
            this.casesService.getSoftwareTitle(this.id).subscribe(result => {
                this.softwareModel = result;
            }, error => console.error(error));
        });
    }

    onSubmit(caseForm) {
        this.casesService.updateSoftwareTitle(this.softwareModel).subscribe(result => {
            this.router.navigate(['/view-software']);
        }, errors => {
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors;
            } else {
                this.errorMsg = "Server error";
            }
        });
    }

}

interface SoftwareModel {
    id: number;
    name: string;
}
