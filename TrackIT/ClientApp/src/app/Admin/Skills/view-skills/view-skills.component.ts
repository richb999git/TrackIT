import { Component, OnInit, ElementRef, TemplateRef  } from '@angular/core';
import { CasesService, ISkills } from '../../../Cases/_services/cases.service';
import { Router } from '@angular/router';
import { AuthorizeService } from '../../../../api-authorization/authorize.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-view-skills',
  templateUrl: './view-skills.component.html',
  styleUrls: ['./view-skills.component.css']
})
export class ViewSkillsComponent implements OnInit {

    public errorMsg;
    public skills: Array<ISkills>;
    private deleteId: number;

    public sortProperty: string = "";
    public sortAsc: boolean = true;

    private modalRef: BsModalRef;

    constructor(private casesService: CasesService, private router: Router, private authorize: AuthorizeService,
        private elementRef: ElementRef, private modalService: BsModalService) { }

    ngOnInit() {
        this.casesService.getSkills(this.sortProperty, this.sortAsc).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    editSkill(id) {
        this.router.navigate(['/edit-skill/' + id]);
    }

    sortSkills(sortProperty) {
        if (sortProperty == this.sortProperty) this.sortAsc = !this.sortAsc;
        this.sortProperty = sortProperty;
        this.casesService.getSkills(this.sortProperty, this.sortAsc).subscribe(result => {
            this.skills = result;
        }, errors => this.errorMsg = errors);
    }

    deleteSkill(template: TemplateRef<any>, id) {
        this.deleteId = id;
        this.modalRef = this.modalService.show(template);
    }

    confirmDeleteSkill(e) {
        this.modalRef.hide();
        this.casesService.deleteSkill(this.deleteId).subscribe(result => {
            this.skills = this.skills.filter(x => x.id != this.deleteId);
        }, errors => this.errorMsg = errors);
    }

}
