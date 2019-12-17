using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Models
{
    // Not implemented. Was possibly going to have the ability to have customer accounts and users
    // could be part of a company a/c 
    public class Customers
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }

        public string Email { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Address3 { get; set; }

        public string Address4 { get; set; }
    }
}
