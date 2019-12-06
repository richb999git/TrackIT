import { Component, OnInit, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares } from '../../../Cases/_services/cases.service';

@Component({
  selector: 'app-add-software',
  templateUrl: './add-software.component.html',
  styleUrls: ['./add-software.component.css']
})
export class AddSoftwareComponent implements OnInit {

    private softwareModel: SoftwareModel = { name: ""};
    public errorMsg;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
    }

    onSubmit(caseForm) {
        this.casesService.addSoftwareTitle(this.softwareModel).subscribe(result => {
            this.router.navigate(['/view-software']);
        }, errors => this.errorMsg = errors);
    }

}

interface SoftwareModel {
    //id: number;
    name: string;
}
