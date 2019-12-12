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

    public errorMsg;
    private softwareModel: SoftwareModel = { id: 0, name: "" };
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
            this.casesService.getSoftwareTitle(this.id).subscribe(result => {
                this.softwareModel = result;
            }, errors => this.errorMsg = errors);
        });
    }

    onSubmit(caseForm) {
        this.casesService.updateSoftwareTitle(this.softwareModel).subscribe(result => {
            this.router.navigate(['/view-software']);
        }, errors => this.errorMsg = errors);
    }

}

interface SoftwareModel {
    id: number;
    name: string;
}
