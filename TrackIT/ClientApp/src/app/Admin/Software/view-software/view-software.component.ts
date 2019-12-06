import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares } from '../../../Cases/_services/cases.service';
declare var $: any;

@Component({
  selector: 'app-view-software',
  templateUrl: './view-software.component.html',
  styleUrls: ['./view-software.component.css']
})
export class ViewSoftwareComponent implements OnInit {

    public errorMsg;
    public softwares: Array<ISoftwares>;
    private deleteId: number;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef) { }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getSoftwareTitles().subscribe(result => {
            this.softwares = result;
        }, errors => this.errorMsg = errors);
    }

    editSoftware(id) {
        this.router.navigate(['/edit-software/' + id]);  
    }

    deleteSoftware(id) {
        this.deleteId = id;
        $('#myModal').modal('show');
    }

    confirmDeleteSoftware(e) {
        this.casesService.deleteSoftwareTitle(this.deleteId).subscribe(result => {
            this.softwares = this.softwares.filter(x => x.id != this.deleteId);
        }, errors => this.errorMsg = errors);       
    }

}
