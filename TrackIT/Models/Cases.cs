using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class Cases
    {
        public int Id { get; set; }

        public virtual Software Software { get; set; } // Navigation property. It also adds SoftwareId field automatically (FK)

        public virtual ApplicationUser User { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        public string Title { get; set; }

        public string Description { get; set; }

        public int Status { get; set; }  // enum Status as an int

        public DateTime DateOpened { get; set; }

        public DateTime DateAssigned { get; set; }

        public DateTime DateAwaitApproval { get; set; }

        public DateTime DateApproved { get; set; }

        public DateTime DateApplied { get; set; }

        public DateTime DateCompleted { get; set; }

        public DateTime Deadline { get; set; }

        public float TimeSpentHours { get; set; }

        public float EstimatedTimeHours { get; set; }

        public string StaffAssigned { get; set; } // comma delimited string

        public string FilesUploaded { get; set; } // comma delimited string of references to files stored in Cloudify

        public int Type { get; set; } // enum Type as an int

        public int UrgencyLevel { get; set; }
    }

    enum Type { Bug = 1, Question, Issue, FeatureRequest };
    enum Status { Opened = 1, Assigned, AwaitingCustomer, OnHold, AwaitingApproval, Applied, Complete };
    enum UrgencyLevel { Critical = 1, High, Medium, Low };
    enum Importance { }; // needed?

    class EnumStrings
    {
        public string[] StatusNames = new string[]
        {
            "Opened",
            "Assigned",
            "Awaiting Customer",
            "On Hold",
            "Awaiting Approval",
            "Applied Fix/Feature",
            "Complete"
        };

        public string[] Types = new string[]
        {
            "Bug", "Question", "Issue", "Feature Request"
        };

        public string[] UrgencyLevels = new string[]
        {
            "Critical", "High", "Medium (Normal)", "Low"
        };
    }

}
