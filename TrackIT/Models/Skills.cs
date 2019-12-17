using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    // Table will have multiple UserIds and multiple SkillIds
    // Need to be able to have Administrator (and Manager?) to be able to add skills to employees
    // This table will then be used in the assign employee area
    public class EmployeeSkills
    {
        public int Id { get; set; }

        public int SkillsId { get; set; }
        public virtual Skills Skills { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        public string UserId { get; set; }
        public virtual ApplicationUser User { get; set; } // Navigation property. It also adds UserId field automatically (FK)

        public int Experience { get; set; } // enum? 1 = Excellent, 2 = Good, 3 = Beginner, 4 = None

    }

    // Need Administrator to be able to add these so full CRUD
    public class Skills
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Type { get; set; } // enum? 1 = Language, 2 = Framework/Library, 3 = Other

    }
}
