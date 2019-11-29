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

    getCases(caseFilter, softwareFilter, sort, sortAsc) {
        return this.http.get<ICases[]>(this.baseUrl + 'api/CasesUser?caseFilter=' + caseFilter + '&softwareFilter=' + softwareFilter
                                                    + '&sort=' + sort + '&sortAsc=' + sortAsc);
    }

    getCasesSupport(caseFilter, softwareFilter, typeFilter, sort, sortAsc) {
        return this.http.get(this.baseUrl + 'api/CasesSupport?caseFilter=' + caseFilter + '&softwareFilter=' + softwareFilter
                                          + '&typeFilter=' + typeFilter + '&sort=' + sort + '&sortAsc=' + sortAsc);
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

    addSoftwareTitle(model) {
        return this.http.post(this.baseUrl + 'api/Softwares', model);
    }

    getUsers(role: string) {
        return this.http.get(this.baseUrl + 'api/Users/' + role);
    }

    getCaseMessages(caseId: string) {
        return this.http.get<IMessages[]>(this.baseUrl + 'api/MessagesInCase/' + caseId);
    }

    addCaseMessage(model: any) {
        return this.http.post(this.baseUrl + 'api/Messages', model);
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
