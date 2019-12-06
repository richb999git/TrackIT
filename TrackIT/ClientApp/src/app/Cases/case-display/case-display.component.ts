import { Component, OnInit, ElementRef } from '@angular/core';
import { CasesService, IMessages, ICases, ISoftwares, IFiles } from '../_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-display',
  templateUrl: './case-display.component.html',
  styleUrls: ['./case-display.component.css']
})
export class CaseDisplayComponent implements OnInit {

    private errorMsg: any;
    private case: ICases;
    private id: string;
    private messages: Array<IMessages>;
    private message: IMessages = {comment: "", userId: "", caseId: null, isEmployee: true, timeStamp: null};
    private messageModel: MessageModel = { comment: "" };
    private files: Array<IFiles>;
    private file: IFiles = { description: "", publicId: "", url: "", caseId: null, timeStamp: null, file: null };
    private openFileUpload: boolean = false;
    private fileModel: FileModel = { description: "" };

    constructor(private casesService: CasesService, private _route: ActivatedRoute, private elementRef: ElementRef) {
        // For a static snapshot of the route...
        this.id = _route.snapshot.paramMap.get("id"); // preferred way to get param
    }

    ngAfterViewInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }

    ngOnInit() {
        this.casesService.getCase(this.id).subscribe(result => {
            this.case = result;
        }, error => console.error(error));

        this.casesService.getCaseMessages(this.id).subscribe(result => {
            this.messages = result;
        }, error => console.error(error));

        this.casesService.getCaseFiles(this.id).subscribe(result => {
            this.files = result;
            console.log(this.files);
        }, error => console.error(error));
    }

    onSubmitMessage(messageForm) {
        this.message = { comment: this.messageModel.comment, userId: this.case.userId, caseId: this.case.id, isEmployee: false, timeStamp: null };
        this.casesService.addCaseMessage(this.message).subscribe(result => {
            this.message.timeStamp = new Date();
            this.messages.push(this.message);
        }, errors => {
            if (errors.status === 400) {
                this.errorMsg = errors.error.errors;
            } else {
                this.errorMsg = "Server error";
            }
        });
        messageForm.reset(); // or messageForm.resetForm();
    }

    downloadFile() {
        console.log("In download file section");
        // need to just download the file. Not sure how to do that yet. Get http link and go to it? RowAndGo had an download section so check it.
    }

    openFileUploadBox() {
        this.openFileUpload = true;
    }

    uploadFile(form) {
        this.file.description = this.fileModel.description;
        this.file.timeStamp = new Date();
        this.openFileUpload = false;
        this.casesService.postCaseFile(this.file).subscribe(result => {
            console.log(result);
            this.files.push(this.file)
            this.file = null;
            // display a message to say file uploaded?
        }, error => console.error(error));
    }

    chooseFile(filesChosen: FileList) {
        if (filesChosen) {
            this.file.file = filesChosen.item(0);
            this.file.caseId = this.case.id;          
        }
    }

    cancelUpload() {
        this.openFileUpload = false;
        this.file = { description: "", publicId: "", url: "", caseId: null, timeStamp: null, file: null };
        this.fileModel.description = "";
    }
}

interface MessageModel {
    //id: number;
    comment: string;
}

interface FileModel {
    description: string;
}
