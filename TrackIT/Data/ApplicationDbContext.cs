using TrackIT.Models;
using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TrackIT.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }
        public DbSet<TrackIT.Models.Software> Software { get; set; }
        public DbSet<TrackIT.Models.Customers> Customers { get; set; }
        public DbSet<TrackIT.Models.Messages> Messages { get; set; }
        public DbSet<TrackIT.Models.Cases> Cases { get; set; }
        public DbSet<TrackIT.Models.FileUploads> FileUploads { get; set; }
        public DbSet<TrackIT.Models.Skills> Skills { get; set; }
        public DbSet<TrackIT.Models.EmployeeSkills> EmployeeSkills { get; set; }

    }
}
