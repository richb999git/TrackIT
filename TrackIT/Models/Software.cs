using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class Software
    {
        public int Id { get; set; }

        [StringLength(50, MinimumLength = 2)]
        [Required]
        public string Name { get; set; }
    }
}
