using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    public class FileUploads
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public virtual Cases Case { get; set; } // Navigation property. It also adds CaseId field automatically (FK)
        public string URL { get; set; }
        public DateTime? TimeStamp { get; set; }
        public string Description { get; set; }
        public string PublicId { get; set; }
    }
}
