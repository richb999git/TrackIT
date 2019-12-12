using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class Messages
    {
        public int Id { get; set; }

        [StringLength(1000, MinimumLength = 2)]
        [Required]
        public string Comment { get; set; }

        public DateTime? TimeStamp { get; set; }

        public int CaseId { get; set; }
        public virtual Cases Case { get; set; } // Navigation property. It also adds CaseId field automatically (FK)

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        public bool IsEmployee { get; set; } // True = Employee message, False = Customer message
    }
}
