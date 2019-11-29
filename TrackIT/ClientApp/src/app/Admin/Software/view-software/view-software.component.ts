import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares } from '../../../Cases/_services/cases.service';

@Component({
  selector: 'app-view-software',
  templateUrl: './view-software.component.html',
  styleUrls: ['./view-software.component.css']
})
export class ViewSoftwareComponent implements OnInit {

    public errorMsg;
    public softwares: Array<ISoftwares>;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
            console.log(result);
        }, error => console.error(error));
    }

    editSoftware(id) {
        console.log("now go to edit");
        console.log(id);
    }

}

interface SoftwareModel {
    //id: number;
    title: string;
}
