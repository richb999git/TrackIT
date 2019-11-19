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
        return this.http.get(this.baseUrl + 'api/Cases/' + id);
    }

    addCase(model: any) {
        return this.http.post(this.baseUrl + 'api/Cases', model);
    }

    getSoftwareTitles() {
        return this.http.get<ISoftwares>(this.baseUrl + 'api/Softwares');
    }
}

export interface ICases {
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


/*
        ***public int Id { get; set; }

        public virtual Software Software { get; set; } // Navigation property. It also adds SoftwareId field automatically (FK)

        public virtual ApplicationUser User { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        ***public string Title { get; set; }

        ***public string Description { get; set; }

        ***public int Status { get; set; }  // enum Status as an int

        public DateTime DateOpened { get; set; }

        public DateTime DateAssigned { get; set; }

        public DateTime DateAwaitApproval { get; set; }

        public DateTime DateApproved { get; set; }

        public DateTime DateApplied { get; set; }

        ***public DateTime DateCompleted { get; set; }

        public DateTime Deadline { get; set; }

        public float TimeSpentHours { get; set; }

        public float EstimatedTimeHours { get; set; }

        public string StaffAssigned { get; set; } // comma delimited string

        public string FilesUploaded { get; set; } // comma delimited string of references to files stored in Cloudify

        ***public int Type { get; set; } // enum Type as an int

        public int UrgencyLevel { get; set; }

*/
