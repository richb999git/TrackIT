import { Injectable, Inject, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'oidc-client';

@Injectable({
  providedIn: 'root'
})
export class CasesService {

    // duplicate of levels in c# class EnumStrings
    public statusNames = [
        "Opened",
        "Assigned",
        "Awaiting Customer",
        "On Hold",
        "Awaiting Approval",
        "Applied Fix/Feature",
        "Complete"
    ];

    // duplicate of levels in c# class EnumStrings
    public types = [
        "Bug", "Question", "Issue", "Feature Request"
    ];

    // duplicate of levels in c# class EnumStrings
    public urgencyLevels = [
        "Critical", "High", "Medium", "Low"
    ]

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getCases(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString) {
        return this.http.get<ICasesPagination>(this.baseUrl + 'api/CasesUser?caseFilter=' + caseFilter + '&softwareFilter=' + softwareFilter
            + '&sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex + '&searchString=' + searchString);
    }

    getCasesSupport(caseFilter, softwareFilter, typeFilter, sort, sortAsc, pageIndex, searchString) {
        return this.http.get<ICasesPagination>(this.baseUrl + 'api/CasesSupport?caseFilter=' + caseFilter + '&softwareFilter=' + softwareFilter
            + '&typeFilter=' + typeFilter + '&sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex + '&searchString=' + searchString);
    }

    getCase(id) {
        return this.http.get<ICases>(this.baseUrl + 'api/Case/' + id);
    }

    addCase(model: any) {
        return this.http.post(this.baseUrl + 'api/Cases', model);
    }

    updateCase(model: any) {
        return this.http.put(this.baseUrl + 'api/Cases/' + model.id, model);
    }

    getSoftwareTitles() {
        return this.http.get<ISoftwares[]>(this.baseUrl + 'api/Softwares');
    }

    getSoftwareTitle(id) {
        return this.http.get<ISoftwares>(this.baseUrl + 'api/Softwares/' + id);
    }

    addSoftwareTitle(model) {
        return this.http.post(this.baseUrl + 'api/Softwares', model);
    }

    updateSoftwareTitle(model) {
        return this.http.put(this.baseUrl + 'api/Softwares/' + model.id, model);
    }

    deleteSoftwareTitle(id) {
        return this.http.delete(this.baseUrl + 'api/Softwares/' + id);
    }

    // return type will need to be changed
    getUsersByRole(role: string, sort: string, sortAsc: boolean, pageIndex: number) {
        return this.http.get<IUsersPagination>(this.baseUrl + 'api/UsersByRole/' + role + "?" + 'sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex);
    }

    getUser(id) {
        return this.http.get<IUser>(this.baseUrl + 'api/User/' + id);
    }

    updateEmployee(model) {
        console.log(model);
        return this.http.put(this.baseUrl + 'api/UserDetails/' + model.id, model);
    }

    getCaseMessages(caseId: string) {
        return this.http.get<IMessages[]>(this.baseUrl + 'api/MessagesInCase/' + caseId);
    }

    addCaseMessage(model: any) {
        return this.http.post(this.baseUrl + 'api/Messages', model);
    }

    getCaseFiles(caseId: string) {
        return this.http.get<IFiles[]>(this.baseUrl + 'api/FileUploadsInCase/' + caseId);
    }

    setSubPageBackground() {
        //this.elementRef.nativeElement.ownerDocument.body.style.backgroundImage = "none";
        //this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#DDFFEF";
    }
}

export interface ICases { // should add more if needed
    id: number;
    title: string;
    description: string;
    type: number;
    dateCompleted: Date;
    status: string;
    userId: string;
    user: User;
}

export interface ISoftwares {
    id: number;
    name: string;
}

export interface IMessages {
    //id: number;  // auto so not needed
    comment: string;
    timeStamp: Date;
    userId: string;
    isEmployee: boolean;
    caseId: number;
}

export interface ICasesPagination {
    cases: ICases,
    pageIndex: number,
    totalPages: number,
    pageSize: number
}

export interface IUser {
    find(arg0: (i: any) => boolean); // so find can be used
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    isManager: boolean;
}

export interface IUsersPagination {
    users: IUser,
    pageIndex: number,
    totalPages: number,
    pageSize: number
}

export interface IFiles {
    //id: number;  // auto so not needed
    description: string;
    timeStamp: Date;
    caseId: number;
    publicId: string;
    URL: string;
}
