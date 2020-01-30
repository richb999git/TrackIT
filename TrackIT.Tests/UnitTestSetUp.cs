using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Text;
using TrackIT.Data;

namespace TrackIT.Tests
{
    public class UnitTestSetUp: IDisposable
    {
        protected readonly ApplicationDbContext context;

        public UnitTestSetUp()
        {
            // Need operationalStoreOptions when instantiating from "ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>"
            IOptions<OperationalStoreOptions> operationalStoreOptions = Options.Create<OperationalStoreOptions>(new OperationalStoreOptions());
            IOptions<OperationalStoreOptions> operationalStoreOptions2 = Options.Create<OperationalStoreOptions>(new OperationalStoreOptions()
            {
                //DeviceFlowCodes = new TableConfiguration("DeviceCodes"), // optional?
                //EnableTokenCleanup = false, // optional
                //PersistedGrants = new TableConfiguration("PersistedGrants"), // optional?
                //TokenCleanupBatchSize = 100, // optional?
                //TokenCleanupInterval = 3600, // optional?
            });
            // Got helper function from https://stackoverflow.com/questions/40876507/net-core-unit-testing-mock-ioptionst
            // Got data from https://medium.com/@rackriili/hello-thanks-for-answering-55cf54f2d05c. They don't actually seem to be needed.


            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString()) // if you want to use an in memory database (not relational but quick)
                                                                //.UseSqlite("DataSource=:memory:", x => { })  // if you want to use in memory sqlite database (slower but relational)
                .Options;

            context = new ApplicationDbContext(options, operationalStoreOptions);

            //context.Database.OpenConnection(); // if you want to use in memory sqlite database (slower but relational)
            context.Database.EnsureCreated();

        }

        // Runs after each test. They would all be deleted at the end of the tests but if it was in production
        // there would be a lot of tests so this avoids them building up.
        public void Dispose()
        {
            context.Database.EnsureDeleted();
            context.Dispose();
        }

    }
}
