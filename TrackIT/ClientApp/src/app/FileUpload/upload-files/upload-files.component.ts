import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CasesService, IFiles } from '../../Cases/_services/cases.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

    @Input() caseId: string; //caseId is a number

    private errorMsg: any;
    private files: Array<IFiles>;
    private file: IFiles = { description: "", publicId: "", url: "", caseId: null, timeStamp: null, file: null };
    private openFileUpload: boolean = false;
    private fileModel: FileModel = { description: "" };
    private showFiles: boolean = false;
    private showHide: string = "\u21E9"; // "Show" down arrow

    constructor(private casesService: CasesService) { }

    ngOnInit() {
        this.casesService.getCaseFiles(this.caseId).subscribe(result => {
            this.files = result;
        }, errors => this.errorMsg = errors);
    }

    downloadFile() {
        // downloads or shows the file based on what the browser can do - see html
    }

    openFileUploadBox() {
        this.openFileUpload = true;
    }

    uploadFile(form) {
        this.file.description = this.fileModel.description;
        this.file.timeStamp = new Date();
        this.casesService.postCaseFile(this.file).subscribe(result => {
            this.openFileUpload = false;
            this.errorMsg = null;
            this.file = result;
            this.files.push(this.file)
            this.file = null;
            this.showFiles = true;
            this.showHide = "\u21E9"; // "Show" down arrow
        }, errors => this.errorMsg = errors);
    }

    chooseFile(filesChosen: FileList) {
        if (filesChosen) {
            this.file.file = filesChosen.item(0);
            this.file.caseId = parseInt(this.caseId);
        }
    }

    cancelUpload() {
        this.openFileUpload = false;
        this.errorMsg = null;
        this.file = { description: "", publicId: "", url: "", caseId: null, timeStamp: null, file: null };
        this.fileModel.description = "";
    }

    toggleShowFiles() {
        this.showFiles = !this.showFiles;
        this.showHide = this.showFiles ? "\u21E7" : "\u21E9"; // "Hide" up arrow, "Show" down arrow
    }
}

interface FileModel {
    description: string;
}
