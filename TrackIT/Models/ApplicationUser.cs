using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class ApplicationUser : IdentityUser
    {
        public virtual Customers Customer { get; set; }  // Navigation property. It also adds CustomerId field automatically (FK)

        [Required]
        public string FirstName { get; set; }

        [StringLength(40, MinimumLength = 2)]
        [Required]
        public string LastName { get; set; }

    }
}
