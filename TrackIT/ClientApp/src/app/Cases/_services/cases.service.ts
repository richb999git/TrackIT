import { Injectable, Inject, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'oidc-client';
import { encode } from 'punycode';

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

    public skillTypes = [
        "Language", "Framework/Library", "Other"
    ]

    public experienceTypes = [
        "Excellent", "Good", "Beginner"
    ]

    // pagination sort/filter/search properties:
    private caseFilter: number;
    private softwareFilter: number;
    private typeFilter: number;
    private sortProperty: string;
    private sortAsc: boolean;
    private searchString: string;
    // pagination properties:
    private pageIndex: number = 1;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

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
            skillSearch = skillSearch.replace(/\+/g, '%2B'); // replace + so that c++ can be searched for
        }       
        return this.http.get<IUsersPagination>(this.baseUrl + 'api/UsersByRoleBySkill/' + role + "?" + 'skill=' + skillFilter + '&sort=' + sort + '&sortAsc=' + sortAsc + '&pageIndex=' + pageIndex + '&skillSearch=' + skillSearch);
    }

    getUser(id) {
        return this.http.get<IUser>(this.baseUrl + 'api/User/' + id);
    }

    updateEmployee(model) {
        console.log(model);
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
        console.log(formData);
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
        console.log(model);
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
        console.log(id);
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
        console.log(userIdsStr);
        return this.http.get<IEmployeeSkills[]>(this.baseUrl + 'api/AllSkillsOfAllEmployees?' + userIdsStr);
    }

    addSkillToEmployee(model) {
        console.log(model);
        return this.http.post(this.baseUrl + 'api/EmployeeSkills', model);
    }

    updateSkillOfEmployee(model) {
        console.log(model);
        return this.http.put(this.baseUrl + 'api/EmployeeSkills/' + model.id, model);
    }

    deleteSkillOfEmployee(id) {
        console.log(id);
        return this.http.delete(this.baseUrl + 'api/EmployeeSkills/' + id);
    }



    //-----------------------------------------------------------------------------------------------------------------

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
    url: string;
    file: File;
}

export interface ISkills {
    id: number;
    name: string,
    type: number,
}

export interface IEmployeeSkills {
    id: number;
    skillsId: number,
    skills: ISkills
    userId: string,
    user: IUser;
    experience: number
}
