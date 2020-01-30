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
using static TrackIT.Controllers.UsersController;

namespace TrackIT.Tests
{
    public class CasesContollerTests : UnitTestSetUp
    {

        public CasesContollerTests()
        {
            var software = new List<Software>()
            {
                new Software { Id = 1, Name = "TrackIT"},
                new Software { Id = 2, Name = "GymBooker"},
                new Software { Id = 3, Name = "Row&Go!"},
            };

            context.Software.AddRange(software);
            context.SaveChanges();

            var skills = new List<Skills>()
            {
                new Skills { Id = 1, Name = "C#", Type = 1},
                new Skills { Id = 2, Name = "Javascript", Type = 1},
                new Skills { Id = 3, Name = "Python", Type = 1},
                new Skills { Id = 4, Name = "C", Type = 1},
                new Skills { Id = 5, Name = "PHP", Type = 1},
                new Skills { Id = 6, Name = "Laravel", Type = 2},
                new Skills { Id = 7, Name = "ASP.NET Core", Type = 2},
            };

            context.Skills.AddRange(skills);
            context.SaveChanges();

            var users = new[]
            {
                new ApplicationUser { Id = "a1", UserName = "SarahWest", FirstName = "Sarah", LastName = "West", Email = "sarah@west.com" },
                new ApplicationUser { Id = "a2", UserName = "JohnDoe",  FirstName = "John", LastName = "Doe", Email = "john@doe.com" },
                new ApplicationUser { Id = "a3", UserName = "TimWills",  FirstName = "Tim", LastName = "Wills", Email = "tim@wills.com" }
            };

            context.Users.AddRange(users);
            context.SaveChanges();

            var employeeSkills = new List<EmployeeSkills>()
            {
                new EmployeeSkills { Id = 1, SkillsId = 1, Experience = 1, UserId = "a1" },
                new EmployeeSkills { Id = 2, SkillsId = 2, Experience = 2, UserId = "a1" },
                new EmployeeSkills { Id = 3, SkillsId = 3, Experience = 3, UserId = "a1" },
                new EmployeeSkills { Id = 4, SkillsId = 4, Experience = 2, UserId = "a2" },
                new EmployeeSkills { Id = 5, SkillsId = 2, Experience = 3, UserId = "a2" },
                new EmployeeSkills { Id = 6, SkillsId = 5, Experience = 1, UserId = "a2" },
                new EmployeeSkills { Id = 7, SkillsId = 6, Experience = 1, UserId = "a2" },
                new EmployeeSkills { Id = 8, SkillsId = 1, Experience = 1, UserId = "a3" },
                new EmployeeSkills { Id = 9, SkillsId = 7, Experience = 2, UserId = "a1" },
            };

            context.EmployeeSkills.AddRange(employeeSkills);
            context.SaveChanges();

            var cases = new List<Cases>()
            {
                new Cases { Id = 1, SoftwareId = 2, Title = "Title1", Description = "Desc1", Type = 1, UrgencyLevel = 2, UserId = "a1", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 2, SoftwareId = 2, Title = "Title2", Description = "Desc2", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 3, SoftwareId = 2, Title = "Title3", Description = "Desc3", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 4, SoftwareId = 3, Title = "Title4", Description = "Desc4", Type = 2, UrgencyLevel = 3, UserId = "a1", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 5, SoftwareId = 3, Title = "Title5", Description = "Desc5", Type = 2, UrgencyLevel = 3, UserId = "a3", ContactId = null, Status = 7 },

                new Cases { Id = 6, SoftwareId = 2, Title = "Title6", Description = "Desc6", Type = 1, UrgencyLevel = 2, UserId = "a3", ContactId = null, Status = 1 },
                new Cases { Id = 7, SoftwareId = 3, Title = "Title7", Description = "Desc7", Type = 1, UrgencyLevel = 3, UserId = "a3", ContactId = null, Status = 1 },
                new Cases { Id = 8, SoftwareId = 2, Title = "Title8", Description = "Desc8", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 9, SoftwareId = 3, Title = "Title9", Description = "Desc9", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 10, SoftwareId = 2, Title = "Title10", Description = "Desc10", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 11, SoftwareId = 2, Title = "Title11", Description = "Desc11", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 12, SoftwareId = 2, Title = "Title12", Description = "Desc12", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 13, SoftwareId = 3, Title = "Title13", Description = "Desc13", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 14, SoftwareId = 3, Title = "Title14", Description = "Desc14", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 15, SoftwareId = 3, Title = "Title15", Description = "Desc15", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 16, SoftwareId = 2, Title = "Title16", Description = "Desc16", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 17, SoftwareId = 2, Title = "Title17", Description = "Desc17", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 18, SoftwareId = 2, Title = "Title18", Description = "Desc18", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 19, SoftwareId = 3, Title = "Title19", Description = "Desc19", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 20, SoftwareId = 3, Title = "Title20", Description = "Desc20", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 21, SoftwareId = 3, Title = "Title21", Description = "Desc21", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
            };

            context.Cases.AddRange(cases);
            context.SaveChanges();
        }



        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Recieved_For_User_And_PageIndex_And_Total_Pages()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = completed cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(10, result.Value.Cases.Count);
            Assert.Equal(1, result.Value.PageIndex);
            Assert.Equal(2, result.Value.TotalPages);
            Assert.Equal(10, result.Value.PageSize);
        }

        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Recieved_For_User_With_Search_String()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = "Desc1";
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(10, result.Value.Cases.Count);
            Assert.Equal(1, result.Value.TotalPages);
        }

        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Active_For_User_With_Search_String()
        {
            var query = new CasesController(context);

            int caseFilter = 1;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = "Desc1";
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(4, result.Value.Cases.Count);
        }

        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Active_For_User_With_Search_String_Orderedby_Case_Descending()
        {
            var query = new CasesController(context);

            int caseFilter = 1;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = false;
            int pageIndex = 1;
            string searchString = "Desc1";
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(4, result.Value.Cases.Count);
            Assert.Equal(19, result.Value.Cases.First().Id);
            Assert.Equal(16, result.Value.Cases.Last().Id);
        }

        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Active_For_User_With_Search_String_Returns_PageIndex_And_Total_Pages()
        {
            var query = new CasesController(context);

            int caseFilter = 1;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = false;
            int pageIndex = 1;
            string searchString = "Desc1";
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(4, result.Value.Cases.Count);
            Assert.Equal(1, result.Value.PageIndex);
            Assert.Equal(1, result.Value.TotalPages);
            Assert.Equal(10, result.Value.PageSize);
        }

        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Active_Cases_Recieved_For_User()
        {
            var query = new CasesController(context);

            int caseFilter = 1;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(6, result.Value.Cases.Count);
        }


        // this test has been fixed to user "a2" in the controller for testing
        [Fact]
        public async void GetCasesUser_Check_All_Cases_For_A_Particular_SoftwareId_Recieved_For_User()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = active cases, 0 = all
            int softwareFilter = 2; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(9, result.Value.Cases.Count);
        }

        [Fact]
        public async void GetCasesUser_Check_All_Active_Cases_For_A_Particular_SoftwareId_Recieved_For_User()
        {
            var query = new CasesController(context);

            int caseFilter = 1;  // 1 = active cases, 0 = all
            int softwareFilter = 2; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            // if sample is more than 10 then count should be 10 because of paginated result
            Assert.Equal(3, result.Value.Cases.Count);
        }

        [Fact]
        public async void GetCasesUser_Check_All_Recieved_Returns_OK_And_Paginated_Result()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = active cases, 0 = all
            int softwareFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesUser(caseFilter, softwareFilter, sort, sortAsc, pageIndex, searchString);  // async

            Assert.IsType<ActionResult<PaginatedListCases>>(result);
        }

        // this test has been fixed to user "a2" in the controller for testing and that user is not a manager
        [Fact]
        public async void GetCasesSupport_Check_Employee_Recieves_Correct_Qty_Of_Cases_When_Employee_Is_Assigned_And_Is_Not_A_ManagerOrAdmin()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = completed cases, 0 = all
            int softwareFilter = 0; // 0 = all
            int typeFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesSupport(caseFilter, softwareFilter, typeFilter, sort, sortAsc, pageIndex, searchString);  // async

            Assert.Equal(4, result.Value.Cases.Count);
        }

        // could do more Support tests but they would be the same as the User tests.

        [Fact]
        public async void GetCasesSupport_Check_All_Recieved_Returns_OK_And_Paginated_Result()
        {
            var query = new CasesController(context);

            int caseFilter = 0;  // 1 = completed cases, 0 = all
            int softwareFilter = 0; // 0 = all
            int typeFilter = 0; // 0 = all
            string sort = "case"; // default is "case"
            bool sortAsc = true;
            int pageIndex = 1;
            string searchString = null;
            var result = await query.GetCasesSupport(caseFilter, softwareFilter, typeFilter, sort, sortAsc, pageIndex, searchString);  // async

            Assert.IsType<ActionResult<PaginatedListCases>>(result);
        }

        [Fact]
        public async void GetCase()
        {
            var query = new CasesController(context);

            var result = await query.GetCase(2);  // async

            Assert.Equal(2, result.Value.Id);
            Assert.Equal(2, result.Value.SoftwareId);
            Assert.Equal("Title2", result.Value.Title);
            Assert.Equal("Desc2", result.Value.Description);
            Assert.Equal(1, result.Value.Type);
            Assert.Equal(3, result.Value.UrgencyLevel);
            Assert.Equal("a2", result.Value.UserId);
        }
        
        [Fact]
        public async void GetCase_Returns_OK()
        {
            var query = new CasesController(context);

            var result = await query.GetCase(2);  // async

            Assert.IsType<ActionResult<CasesToReturn>>(result);
        }

        [Fact]
        public async void DeleteCases_Delete_Id_5()
        {
            var query = new CasesController(context);
            
            var result = await query.DeleteCases(3);  // async

            Assert.Equal(3, result.Value.Id);
            Assert.Equal(2, result.Value.SoftwareId);
            Assert.Equal("Title3", result.Value.Title);
            Assert.Equal("Desc3", result.Value.Description);
            Assert.Equal(2, result.Value.UrgencyLevel);
            Assert.Equal("a2", result.Value.UserId);
        }
        
        [Fact]
        public async void DeleteCases_Returns_OK()
        {
            var query = new CasesController(context);

            var result = await query.DeleteCases(3);  // async

            Assert.IsType<ActionResult<Cases>>(result);
        }


        [Fact]
        public async void PostCases_Add()
        {
            var query = new CasesController(context);

            // userId provided but in app it would be taken from the user profile
            var newCase = new Cases { Id = 22, SoftwareId = 1, Title = "Title22", Description = "Desc22", Type = 3, UrgencyLevel = 1, UserId = "a3", ContactId = null };

            var result = await query.PostCases(newCase);  // async
            var added = await query.GetCase(22);  // async

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result.Result);

            Assert.Equal(newCase.Id, added.Value.Id);
            Assert.Equal(newCase.SoftwareId, added.Value.SoftwareId);
            Assert.Equal(newCase.Title, added.Value.Title);
            Assert.Equal(newCase.Description, added.Value.Description);
            Assert.Equal(newCase.Type, added.Value.Type);
            Assert.Equal(newCase.UrgencyLevel, added.Value.UrgencyLevel);
            Assert.Equal(newCase.UserId, added.Value.UserId);
            Assert.Equal(newCase, resultGoodRequest.Value);
            // PostCases returns Cases, Get returns CasesToReturn to not going to be able to compare objects
        }

        [Fact]
        public async void PostCases_Returns_OK()
        {
            var query = new CasesController(context);

            // userId provided but in app it would be taken from the user profile
            var newCase = new Cases { Id = 22, SoftwareId = 1, Title = "Title22", Description = "Desc22", Type = 3, UrgencyLevel = 1, UserId = "a3" };

            var result = await query.PostCases(newCase);  // async

            Assert.IsType<ActionResult<Cases>>(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }
        
        [Fact]
        public async void UpdateCase_Put()
        {
            var query = new CasesController(context);

            var newCase = new Cases { Id = 2, SoftwareId = 2, Title = "Title2a", Description = "Desc2a", Type = 1, UrgencyLevel = 1, UserId = "a2", ContactId = null };

            var newCaseToReturn = new CasesToReturn
            {
                Id = 2,
                SoftwareId = 2,
                Title = "Title2a",
                Description = "Desc2a",
                Type = 1,
                UrgencyLevel = 1,
                UserId = "a2",
                Software = new Software { Id = 2, Name = "GymBooker" },
                UserInfo = new UserInfo { Id = "a2", UserName = "JohnDoe", FirstName = "John", LastName = "Doe", Email = "john@doe.com" },
                ContactInfo = new UserInfo { }
            };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Cases.Local.Where(t => t.Id == 2).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutCases(2, newCase);  // async
            var added = await query.GetCase(2);  // async

            var addedGoodRequest = Assert.IsType<CasesToReturn>(added.Value);

            Assert.Equal(newCase.Id, added.Value.Id);
            Assert.Equal(newCase.SoftwareId, added.Value.SoftwareId);
            Assert.Equal(newCase.Title, added.Value.Title);
            Assert.Equal(newCase.Description, added.Value.Description);
            Assert.Equal(newCase.Type, added.Value.Type);
            Assert.Equal(newCase.UrgencyLevel, added.Value.UrgencyLevel);
            Assert.Equal(newCase.UserId, added.Value.UserId);
            Assert.Equal(Newtonsoft.Json.JsonConvert.SerializeObject(newCaseToReturn), Newtonsoft.Json.JsonConvert.SerializeObject(addedGoodRequest));
            //Assert.Equal(newEmployeeSkillToReturn, addedGoodRequest);
            // not sure why the objects aren't considered to be the same
            // PostCases returns Cases, Get returns CasesToReturn to not going to be able to compare objects
            //Assert.Equal(newEmployeeSkill, result); // No Content returned so can't check it without changing return value
        }

        [Fact]
        public async void UpdateCase_Returns_OK()
        {
            var query = new CasesController(context);

            var newCase = new Cases { Id = 2, SoftwareId = 2, Title = "Title2a", Description = "Desc2a", Type = 1, UrgencyLevel = 1, UserId = "a2" };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Cases.Local.Where(t => t.Id == 2).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutCases(2, newCase);  // async

            Assert.IsType<NoContentResult>(result);
        }

        
    }
}
