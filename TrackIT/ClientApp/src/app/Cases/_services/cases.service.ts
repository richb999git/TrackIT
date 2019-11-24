import { Injectable, Inject } from '@angular/core';
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

    getCases() {
        return this.http.get<ICases[]>(this.baseUrl + 'api/Cases');
    }

    getCasesSupport() {
        return this.http.get(this.baseUrl + 'api/CasesSupport');
    }

    getCase(id) {
        return this.http.get<ICases>(this.baseUrl + 'api/Cases/' + id);
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

    getUsers(role: string) {
        return this.http.get(this.baseUrl + 'api/Users/' + role);
    }

    getCaseMessages(caseId: string) {
        return this.http.get<IMessages[]>(this.baseUrl + 'api/MessagesInCase/' + caseId);
    }

    addCaseMessage(model: any) {
        return this.http.post(this.baseUrl + 'api/Messages', model);
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
