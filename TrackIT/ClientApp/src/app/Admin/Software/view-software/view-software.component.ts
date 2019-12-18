import { Component, OnInit, ElementRef, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { CasesService, ISoftwares } from '../../../Cases/_services/cases.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-software',
  templateUrl: './view-software.component.html',
  styleUrls: ['./view-software.component.css']
})
export class ViewSoftwareComponent implements OnInit {

    public errorMsg;
    public softwares: Array<ISoftwares>;
    private deleteId: number;

    private modalRef: BsModalRef;

    constructor(private casesService: CasesService, private router: Router, private elementRef: ElementRef, private modalService: BsModalService) { }

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

    deleteSoftware(template: TemplateRef<any>, id) {
        this.errorMsg = null;
        this.deleteId = id;
        this.modalRef = this.modalService.show(template);
    }

    confirmDeleteSoftware(e) {
        this.modalRef.hide();
        this.casesService.deleteSoftwareTitle(this.deleteId).subscribe(result => {
            this.softwares = this.softwares.filter(x => x.id != this.deleteId);
        }, errors => this.errorMsg = errors);       
    }

}
