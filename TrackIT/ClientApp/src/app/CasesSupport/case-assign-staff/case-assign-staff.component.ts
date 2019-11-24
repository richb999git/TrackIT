import { Component, OnInit } from '@angular/core';
import { CasesService } from '../../Cases/_services/cases.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-case-assign-staff',
  templateUrl: './case-assign-staff.component.html',
  styleUrls: ['./case-assign-staff.component.css']
})
export class CaseAssignStaffComponent implements OnInit {

    public users: any;
    public assignedUsers: Array<string> = [];
    public caseId: any;

    constructor(private casesService: CasesService, private _route: ActivatedRoute) {
        // For a static snapshot of the route...
        this.caseId = _route.snapshot.paramMap.get("caseId"); // preferred way to get param
    }

    ngOnInit() {
        this.casesService.getUsers("employee").subscribe(result => {
            console.log(result);
            this.users = result;
        }, error => console.error(error));

        // get assigned users, if any
        // var a = gymClass.UserIds.Split(',').ToList(); // c# way to split array into a string in csv format

    }

    assignEmployee(id: string) {
        console.log(id + " assigned");
        // need to add to a list so that once submit is pressed case can be updated (separate list or add to UserInfo?)
        if (this.assignedUsers.includes(id)) {
            this.assignedUsers = this.assignedUsers.filter(e => e !== id);
        } else {
            this.assignedUsers.push(id);
        }       
        console.log(this.assignedUsers);        
    }

    // need the outputted list to show that employee has been assigned (either now (easy?) and previously (hard))
    submitAssignedStaff() {
        console.log("Next - save assigned staff!")
        // update current case StaffAssigned string with array in csv format
        //var a = string.Join(",", this.assignedUsers.Select(n => n.ToString()).ToArray()); c# version

        // convert array into a string - see GymBooker. Or send to back-end and convert there - No, need to send a Case object to Put
        // create case (get it first) and add the StaffAssigned string to it
        // call the Put Case request
        // redirect to case page (which will then show the updated assigned staff)

        // not implementing this - may delete it. It is part of case-display-support component
    }
}
