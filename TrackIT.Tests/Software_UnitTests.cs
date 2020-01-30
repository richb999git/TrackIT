using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using TrackIT.Data;
using Xunit;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using TrackIT.Models;
using TrackIT.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace TrackIT.Tests
{
    public class SoftwareContollerTests : UnitTestSetUp
    {

        public SoftwareContollerTests()
        {
            var software = new List<Software>()
            {
                new Software { Id = 1, Name = "TrackIT"},
                new Software { Id = 2, Name = "GymBooker"},
                new Software { Id = 3, Name = "Row&Go!"},
            };

            context.Software.AddRange(software);
            context.SaveChanges();
        }



        [Fact]
        public async void Check_All_Received()
        {
            var query = new SoftwaresController(context);

            var result = await query.GetSoftware();  // async

            Assert.Equal(3, result.Value.ToList().Count);
            Assert.Equal(3, result.Value.Count());
        }

        [Fact]
        public async void GetAllSoftware_Returns_OK()
        {
            var query = new SoftwaresController(context);

            var result = await query.GetSoftware();  // async

            Assert.IsType<ActionResult<IEnumerable<Software>>>(result);
        }


        [Fact]
        public async void GetAllSoftware_Check_First_And_Last()
        {
            var query = new SoftwaresController(context);

            var result = await query.GetSoftware();  // async

            Assert.Equal("TrackIT", result.Value.First().Name);
            Assert.Equal("Row&Go!", result.Value.Last().Name);
        }

        [Fact]
        public async void GetSoftware_Get_Id_2()
        {
            var query = new SoftwaresController(context);

            var result = await query.GetSoftware(2);  // async

            Assert.Equal("GymBooker", result.Value.Name);
        }

        [Fact]
        public async void GetSoftware_Returns_OK()
        {
            var query = new SoftwaresController(context);

            var result = await query.GetSoftware(2);  // async

            Assert.IsType<ActionResult<Software>>(result);
        }

        [Fact]
        public async void DeleteSoftware_Delete_Id_3()
        {
            var query = new SoftwaresController(context);
            SeedCases(context);
            var result = await query.DeleteSoftware(3);  // async

            Assert.Equal("Row&Go!", result.Value.Name);
        }

        [Fact]
        public async void DeleteSoftware_Delete_Id_2_With_Cases()
        {
            var query = new SoftwaresController(context);
            SeedCases(context);

            var result = await query.DeleteSoftware(2);  // async

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("cannot delete", badRequestResult.Value.ToString());
            Assert.Equal(400, badRequestResult.StatusCode);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async void DeleteSoftware_Returns_OK()
        {
            var query = new SoftwaresController(context);

            var result = await query.DeleteSoftware(3);  // async

            Assert.IsType<ActionResult<Software>>(result);
        }


        [Fact]
        public async void PostSoftware_Add()
        {
            var query = new SoftwaresController(context);

            var newSoftware = new Software { Id = 4, Name = "Bengal Tiger" };

            var result = await query.PostSoftware(newSoftware);  // async
            var added = await query.GetSoftware(4);  // async

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result.Result);
            var addedGoodRequest = Assert.IsType<Software>(added.Value);

            Assert.Equal(newSoftware.Name, added.Value.Name);
            Assert.Equal(newSoftware.Id, added.Value.Id);
            Assert.Equal(newSoftware, added.Value);
            Assert.Equal(newSoftware, resultGoodRequest.Value);
            Assert.Equal(newSoftware, addedGoodRequest);
        }

        [Fact]
        public async void PostSoftware_Returns_OK()
        {
            var query = new SoftwaresController(context);

            var newSoftware = new Software { Id = 4, Name = "Bengal Tiger" };
            var result = await query.PostSoftware(newSoftware);  // async

            Assert.IsType<ActionResult<Software>>(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async void UpdateSoftware_Put()
        {
            var query = new SoftwaresController(context);

            var newSoftware = new Software { Id = 3, Name = "Row And Go!!!" };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Software.Local.Where(t => t.Id == 3).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutSoftware(3, newSoftware);  // async
            var added = await query.GetSoftware(3);  // async
            var addedGoodRequest = Assert.IsType<Software>(added.Value);

            Assert.Equal(newSoftware.Name, added.Value.Name);
            Assert.Equal(newSoftware.Id, added.Value.Id);
            Assert.Equal(newSoftware, added.Value);
            Assert.Equal(newSoftware, addedGoodRequest);
            //Assert.Equal(newSoftware, result); // No Content returned so can't check it without changing return value
        }

        [Fact]
        public async void UpdateSoftware_Returns_OK()
        {
            var query = new SoftwaresController(context);

            var newSoftware = new Software { Id = 3, Name = "Row And Go!!!" };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Software.Local.Where(t => t.Id == 3).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutSoftware(3, newSoftware);  // async

            Assert.IsType<NoContentResult>(result);
        }


        internal static void SeedCases(ApplicationDbContext context)
        {
            var cases = new List<Cases>()
            {
                new Cases { Id = 1, SoftwareId = 2, Title = "Title1", Description = "Desc1", Type = 1, UrgencyLevel = 2},
                new Cases { Id = 2, SoftwareId = 2, Title = "Title2", Description = "Desc2", Type = 1, UrgencyLevel = 2},
                new Cases { Id = 3, SoftwareId = 2, Title = "Title3", Description = "Desc3", Type = 1, UrgencyLevel = 2},
            };

            context.Cases.AddRange(cases);
            context.SaveChanges();
        }
    }
}
