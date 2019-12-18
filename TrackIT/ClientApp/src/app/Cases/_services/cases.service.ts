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
        "Fix Approved",
        "Complete",
        "Cancelled"
    ];   

    // duplicate of levels in c# class EnumStrings
    public types = [
        "Bug", "Question", "Issue", "Feature Request"
    ];

    // duplicate of levels in c# class EnumStrings
    public urgencyLevels = [
        "Critical", "High", "Medium", "Low"
    ]

    public skillTypes = [
        "Language", "Framework/Library", "Other"
    ]

    // not currently used
    public experienceTypes = [
        "Excellent", "Good", "Beginner"
    ]

    // pagination sort/filter/search properties (Support):
    private caseFilter: number;
    private softwareFilter: number;
    private typeFilter: number;
    private sortProperty: string;
    private sortAsc: boolean;
    private searchString: string;
    // pagination properties (Support):
    private pageIndex: number = 1;

    // pagination sort/filter/search properties (Users):
    private caseFilterUser: number;
    private softwareFilterUser: number;
    private typeFilterUser: number;
    private sortPropertyUser: string;
    private sortAscUser: boolean;
    private searchStringUser: string;
    // pagination properties (Users):
    private pageIndexUser: number = 1;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    //------------------ Support properties
    setFilters(caseFilter, softwareFilter, typeFilter, sortProperty, sortAsc, pageIndex, searchString) {
        this.caseFilter = caseFilter;
        this.softwareFilter = softwareFilter;
        this.typeFilter = typeFilter;
        this.sortProperty = sortProperty;
        this.sortAsc = sortAsc;
        this.pageIndex = pageIndex;
        this.searchString = searchString;
    }

    // If null set to a default. Boolean has to be treated differently because of truthy/falsy
    getCaseFilter() { return this.caseFilter || 1 };
    getSoftwareFilter() { return this.softwareFilter || 0 };
    getTypeFilter() { return this.typeFilter || 0 };
    getSortProperty() { return this.sortProperty || "" };
    getSortAsc() { return this.sortAsc == null ? true : this.sortAsc };
    getPageIndex() { return this.pageIndex || 0 };
    getSearchString() { return this.searchString || "" };


    //------------------ User properties
    setFiltersUser(caseFilter, softwareFilter, typeFilter, sortProperty, sortAsc, pageIndex, searchString) {
        this.caseFilterUser = caseFilter;
        this.softwareFilterUser = softwareFilter;
        this.typeFilterUser = typeFilter;
        this.sortPropertyUser = sortProperty;
        this.sortAscUser = sortAsc;
        this.pageIndexUser = pageIndex;
        this.searchStringUser = searchString;
    }

    // If null set to a default. Boolean has to be treated differently because of truthy/falsy
    getCaseFilterUser() { return this.caseFilterUser || 1 };
    getSoftwareFilterUser() { return this.softwareFilterUser || 0 };
    getTypeFilterUser() { return this.typeFilterUser || 0 };
    getSortPropertyUser() { return this.sortPropertyUser || "" };
    getSortAscUser() { return this.sortAscUser == null ? true : this.sortAscUser };
    getPageIndexUser() { return this.pageIndexUser || 0 };
    getSearchStringUser() { return this.searchStringUser || "" };

    //--------------- HTTP -------------------------------------------------------------------------------------------------------------------//

    // Return type is not an array. Pagination is an object that INCLUDES an array
    getCases(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString) {
        return this.http.get<ICasesPagination>(this.baseUrl + 'api/CasesUser?caseFilter=' + caseFilter + '&softwareFilter=' + softwareFilter
            + '&sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex + '&searchString=' + searchString);
    }

    // Return type is not an array. Pagination is an object that INCLUDES an array
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

    //-----------------------------------------------------------------------------------------------------------------

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

    //-----------------------------------------------------------------------------------------------------------------

    // Return type is not an array. Pagination is an object that INCLUDES an array
    getUsersByRole(role: string, sort: string, sortAsc: boolean, pageIndex: number) {
        return this.http.get<IUsersPagination>(this.baseUrl + 'api/UsersByRole/' + role + "?" + 'sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex);
    }

    // Return type is not an array. Pagination is an object that INCLUDES an array
    getUsersByRoleBySkill(role: string, skillFilter: number, sort: string, sortAsc: boolean, pageIndex: number, skillSearch: string) {
        if (skillSearch != null) {
            skillSearch = escape(skillSearch); // escape so that c# can be searched for (plus other special characters)
            skillSearch = skillSearch.replace(/\+/g, '%2B'); // replace + so that c++ can be searched for ( a "+" is converted to a space otherwise )
        }       
        return this.http.get<IUsersPagination>(this.baseUrl + 'api/UsersByRoleBySkill/' + role + "?" + 'skill=' + skillFilter + '&sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex + '&skillSearch=' + skillSearch);
    }

    getUser(id) {
        return this.http.get<IUser>(this.baseUrl + 'api/User/' + id);
    }

    updateEmployee(model) {
        return this.http.put(this.baseUrl + 'api/UserDetails/' + model.id, model);
    }

    //-----------------------------------------------------------------------------------------------------------------

    getCaseMessages(caseId: string) { // caseId is a number but passed to here as a string
        return this.http.get<IMessages[]>(this.baseUrl + 'api/MessagesInCase/' + caseId);
    }

    addCaseMessage(model: any) {
        return this.http.post(this.baseUrl + 'api/Messages', model);
    }

    //-----------------------------------------------------------------------------------------------------------------

    getCaseFiles(caseId: string) {
        return this.http.get<IFiles[]>(this.baseUrl + 'api/FileUploadsInCase/' + caseId);
    }

    postCaseFile(file: IFiles) {
        const formData: FormData = new FormData();
        formData.append('File', file.file, file.file.name);
        formData.append('caseId', file.caseId.toString());
        formData.append('description', file.description);
        return this.http.post<IFiles>(this.baseUrl + 'api/FileUploads', formData)            
    }

    //-----------------------------------------------------------------------------------------------------------------

    getSkill(id: number) {
        return this.http.get<ISkills>(this.baseUrl + 'api/Skills/' + id);
    }

    getSkills(sort, sortAsc) {
        return this.http.get<ISkills[]>(this.baseUrl + 'api/Skills' + "?" + 'sort=' + sort + '&sortAsc=' + sortAsc);
    }

    addSkill(model) {
        return this.http.post(this.baseUrl + 'api/Skills', model);
    }

    updateSkill(model) {
        return this.http.put(this.baseUrl + 'api/Skills/' + model.id, model);
    }

    deleteSkill(id) {
        return this.http.delete(this.baseUrl + 'api/Skills/' + id);
    }

    //-----------------------------------------------------------------------------------------------------------------

    // get all skills of a single employee
    getAllEmployeeSkills(userId: string) {
        return this.http.get<IEmployeeSkills[]>(this.baseUrl + 'api/AllEmployeeSkills/' + userId);
    }

    // get a specific skill by id
    getEmployeeSkill(id: number) {
        return this.http.get<IEmployeeSkills>(this.baseUrl + 'api/EmployeeSkillById/' + id);
    }

    // get all the skills of all the employees in the array (will be limited to 10 to 20 employees)
    getAllSkillsOfAllEmployees(users: any, skillId: number) {
        // create query string
        var userIdsStr = "";
        for (var i = 0; i < users.length; i++) {
            if (i == 0) {
                userIdsStr = userIdsStr + "users=" + users[i].id
            } else {
                userIdsStr = userIdsStr + "&users=" + users[i].id
            }
        }
        userIdsStr += "&skill=" + skillId; 
        return this.http.get<IEmployeeSkills[]>(this.baseUrl + 'api/AllSkillsOfAllEmployees?' + userIdsStr);
    }

    addSkillToEmployee(model) {
        return this.http.post(this.baseUrl + 'api/EmployeeSkills', model);
    }

    updateSkillOfEmployee(model) {
        return this.http.put(this.baseUrl + 'api/EmployeeSkills/' + model.id, model);
    }

    deleteSkillOfEmployee(id) {
        return this.http.delete(this.baseUrl + 'api/EmployeeSkills/' + id);
    }



    //-----------------------------------------------------------------------------------------------------------------

}

export interface ICases { // should add more if needed
    id: number;
    title: string;
    description: string;
    type: number;
    dateCompleted: Date;
    status: number; // why was it string? corrected 16th Dec
    userId: string;
    user: User;
    // added
    staffAssigned: string;
    contactId: string;
    estimatedTimeHours: number;
    timeSpentHours: number;
    deadline: Date;
    dateAssigned: Date; //any; // it is converted to a string temporarily - see line 161 of assign-staff.component.ts (look into changing)
    dateAwaitApproval: Date;
    dateApproved: Date;
    dateApplied: Date;
    contactInfo: IUser;
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
    cases: ICases;
    pageIndex: number;
    totalPages: number;
    pageSize: number;
}

export interface IUser {
    [x: string]: any; // so slice and findIndex can be used
    find(arg0: (i: any) => boolean); // so find can be used - not sure this is needed if above is included
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    userName: string;
    isManager: boolean;
}

export interface IUsersPagination {
    users: IUser;
    pageIndex: number;
    totalPages: number;
    pageSize: number;
}

export interface IFiles {
    //id: number;  // auto so not needed
    description: string;
    timeStamp: Date;
    caseId: number;
    publicId: string;
    url: string;
    file: File;
}

export interface ISkills {
    id: number;
    name: string;
    type: number;
}

export interface IEmployeeSkills {
    id: number;
    skillsId: number;
    skills: ISkills;
    userId: string;
    user: IUser;
    experience: number;
}

export interface IUsersWithSkills {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    isManager: boolean;
    skills: any; // dynamic array of skills
}

export enum CaseType { Bug = 1, Question, Issue, FeatureRequest };
export enum CaseStatus { Opened = 1, Assigned, AwaitingCustomer, OnHold, AwaitingApproval, FixApproved, Complete, Cancelled };
export enum CaseUrgencyLevel { Critical = 1, High, Medium, Low };
