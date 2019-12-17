using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class Cases
    {
        public int Id { get; set; }
         
        public int SoftwareId { get; set; }
        public virtual Software Software { get; set; } // Navigation property. It also adds SoftwareId field automatically (FK)

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        [StringLength(100, MinimumLength = 2)]
        [Required]
        public string Title { get; set; }

        [StringLength(1000, MinimumLength = 3)]
        [Required]
        public string Description { get; set; }

        public string ContactId { get; set; }
        public virtual ApplicationUser Contact { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        public int Status { get; set; }  // enum Status as an int

        public DateTime? DateOpened { get; set; }

        public DateTime? DateAssigned { get; set; }

        public DateTime? DateAwaitApproval { get; set; }

        public DateTime? DateApproved { get; set; }

        public DateTime? DateApplied { get; set; }

        public DateTime? DateCompleted { get; set; }

        public DateTime? Deadline { get; set; }

        public float? TimeSpentHours { get; set; }

        public float? EstimatedTimeHours { get; set; }

        public string StaffAssigned { get; set; } // comma delimited string

        public string FilesUploaded { get; set; } // comma delimited string of references to files stored in Cloudinary (using separate table)

        [Required]
        public int Type { get; set; } // enum Type as an int

        [Required]
        public int UrgencyLevel { get; set; }
    }
    
}
