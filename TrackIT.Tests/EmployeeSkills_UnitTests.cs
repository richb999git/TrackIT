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
    public class EmployeeSkillsContollerTests : UnitTestSetUp
    {

        public EmployeeSkillsContollerTests()
        {           
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
        }



        [Fact]
        public async void Check_All_Received()
        {
            var query = new EmployeeSkillsController(context);

            var result = await query.GetEmployeeSkills();  // async

            Assert.Equal(9, result.Value.ToList().Count);
            Assert.Equal(9, result.Value.Count());
        }

        [Fact]
        public async void GetEmployeeSkills_All_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var result = await query.GetEmployeeSkills();  // async

            Assert.IsType<ActionResult<IEnumerable<EmployeeSkills>>>(result);
        }

        [Fact]
        public async void GetEmployeeSkillById()
        {
            var query = new EmployeeSkillsController(context);

            var result = await query.GetEmployeeSkillById(5);  // async

            var skill5 = new EmployeeSkillsToReturn { Id = 5, SkillsId = 2, Experience = 3, UserId = "a2",
                UserInfo = new UserInfo { Id = "a2", UserName = "JohnDoe", FirstName = "John", LastName = "Doe", Email = "john@doe.com", IsManager = null },
                Skills = new Skills { Id = 2, Name = "Javascript", Type = 1 }
            };

            Assert.Equal(2, result.Value.SkillsId);
            Assert.Equal(3, result.Value.Experience);
            Assert.Equal("a2", result.Value.UserId);
            Assert.Equal(Newtonsoft.Json.JsonConvert.SerializeObject(skill5), Newtonsoft.Json.JsonConvert.SerializeObject(result.Value));
            // not sure why the objects aren't considered to be the same
        }
       
        [Fact]
        public async void GetEmployeeSkillById_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var result = await query.GetEmployeeSkillById(5);  // async

            Assert.IsType<ActionResult<EmployeeSkillsToReturn>>(result);
        }

        [Fact]
        public async void GetAllSkillsOfAllEmployees_One_Skill()
        {
            var query = new EmployeeSkillsController(context);

            var users = new string[] { "a1", "a2" };

            var result = await query.GetAllSkillsOfAllEmployees(users, 2);  // async

            Assert.Equal(2, result.Value.Count());
            Assert.Equal(2, result.Value.First(x => x.UserId == "a1").SkillsId);
            Assert.Equal(2, result.Value.First(x => x.UserId == "a1").Experience);
            Assert.Equal("a1", result.Value.First(x => x.UserId == "a1").UserId);
            Assert.Equal(2, result.Value.First(x => x.UserId == "a2").SkillsId);
            Assert.Equal(3, result.Value.First(x => x.UserId == "a2").Experience);
            Assert.Equal("a2", result.Value.First(x => x.UserId == "a2").UserId);
        }

        [Fact]
        public async void GetAllSkillsOfAllEmployees_All_Skill_Of_One_Employee()
        {
            var query = new EmployeeSkillsController(context);

            var users = new string[] { "a1" };

            var result = await query.GetAllSkillsOfAllEmployees(users, 0);  // async

            var resultAsArray = result.Value.OrderBy(x => x.SkillsId).ToArray();

            Assert.Equal(4, resultAsArray.Length);
            Assert.Equal(1, resultAsArray[0].SkillsId);
            Assert.Equal(2, resultAsArray[1].SkillsId);
            Assert.Equal(3, resultAsArray[2].SkillsId);
            Assert.Equal(7, resultAsArray[3].SkillsId);
        }

        [Fact]
        public async void GetAllSkillsOfAllEmployees_All_Skill_Of_2_Employees()
        {
            var query = new EmployeeSkillsController(context);

            var users = new string[] { "a1", "a2" };

            var result = await query.GetAllSkillsOfAllEmployees(users, 0);  // async

            var resultAsArray = result.Value.OrderBy(x => x.UserId).ThenBy(x => x.SkillsId).ToArray();

            Assert.Equal(8, resultAsArray.Length);
            Assert.Equal(1, resultAsArray[0].SkillsId);
            Assert.Equal(2, resultAsArray[1].SkillsId);
            Assert.Equal(3, resultAsArray[2].SkillsId);
            Assert.Equal(7, resultAsArray[3].SkillsId);
            Assert.Equal(2, resultAsArray[4].SkillsId);
            Assert.Equal(4, resultAsArray[5].SkillsId);
            Assert.Equal(5, resultAsArray[6].SkillsId);
            Assert.Equal(6, resultAsArray[7].SkillsId);
            Assert.Equal("a1", resultAsArray[0].UserId);
            Assert.Equal("a1", resultAsArray[1].UserId);
            Assert.Equal("a1", resultAsArray[2].UserId);
            Assert.Equal("a1", resultAsArray[3].UserId);
            Assert.Equal("a2", resultAsArray[4].UserId);
            Assert.Equal("a2", resultAsArray[5].UserId);
            Assert.Equal("a2", resultAsArray[6].UserId);
            Assert.Equal("a2", resultAsArray[7].UserId);
        }

        [Fact]
        public async void GetAllSkillsOfAllEmployees_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var users = new string[] { "a1", "a2" };

            var result = await query.GetAllSkillsOfAllEmployees(users , 2);  // async

            Assert.IsType<ActionResult<IEnumerable<EmployeeSkillsToReturn>>>(result);
        }

        [Fact]
        public async void GetAllEmployeeSkills()
        {
            var query = new EmployeeSkillsController(context);

            var userId = "a1";
            
            var result = await query.GetAllEmployeeSkills(userId);  // async

            var resultAsArray = result.Value.OrderBy(x => x.SkillsId).ToArray();

            Assert.Equal(4, resultAsArray.Length);
            Assert.Equal(1, resultAsArray[0].SkillsId);
            Assert.Equal(2, resultAsArray[1].SkillsId);
            Assert.Equal(3, resultAsArray[2].SkillsId);
            Assert.Equal(7, resultAsArray[3].SkillsId);
        }

        [Fact]
        public async void GetAllEmployeeSkills_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var userId = "a1";

            var result = await query.GetAllEmployeeSkills(userId);  // async

            Assert.IsType<ActionResult<IEnumerable<EmployeeSkillsToReturn>>>(result);
        }

        [Fact]
        public async void DeleteEmployeeSkills_Delete_Id_5()
        {
            var query = new EmployeeSkillsController(context);
            
            var result = await query.DeleteEmployeeSkills(5);  // async

            Assert.Equal(2, result.Value.SkillsId);
            Assert.Equal(3, result.Value.Experience);
            Assert.Equal("a2", result.Value.UserId);
            Assert.Equal(5, result.Value.Id);
        }

        [Fact]
        public async void DeleteEmployeeSkills_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var result = await query.DeleteEmployeeSkills(3);  // async

            Assert.IsType<ActionResult<EmployeeSkills>>(result);
        }


        [Fact]
        public async void PostExployeeSkills_Add()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 10, SkillsId = 2, Experience = 3, UserId = "a3" };

            var newEmployeeSkillToReturn = new EmployeeSkillsToReturn
            {
                Id = 10,
                SkillsId = 2,
                Experience = 3,
                UserId = "a3",
                Skills = new Skills { Id = 2, Name = "Javascript", Type = 1 },
                UserInfo = new UserInfo { Id = "a3", UserName = "TimWills", FirstName = "Tim", LastName = "Wills", Email = "tim@wills.com", IsManager = null }
            };

            var result = await query.PostEmployeeSkills(newEmployeeSkill);  // async
            var added = await query.GetEmployeeSkillById(10);  // async

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result.Result);
            var addedGoodRequest = Assert.IsType<EmployeeSkillsToReturn>(added.Value);

            Assert.Equal(newEmployeeSkill.Id, added.Value.Id);
            Assert.Equal(newEmployeeSkill.SkillsId, added.Value.SkillsId);
            Assert.Equal(newEmployeeSkill.Experience, added.Value.Experience);
            Assert.Equal(newEmployeeSkill.UserId, added.Value.UserId);
            Assert.Equal(newEmployeeSkill, resultGoodRequest.Value);
            Assert.Equal(Newtonsoft.Json.JsonConvert.SerializeObject(newEmployeeSkillToReturn), Newtonsoft.Json.JsonConvert.SerializeObject(addedGoodRequest));
            //Assert.Equal(newEmployeeSkillToReturn, addedGoodRequest);
            // not sure why the objects aren't considered to be the same
        }

        [Fact]
        public async void PostExployeeSkills_Add_EmployeeSkill_Already_Added()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 10, SkillsId = 1, Experience = 3, UserId = "a3" };

            var result = await query.PostEmployeeSkills(newEmployeeSkill);  // async
            var added = await query.GetEmployeeSkillById(10);  // async

            Assert.Null(added.Value);
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Contains("already added to this employee", badRequestResult.Value.ToString());
            Assert.Equal(400, badRequestResult.StatusCode);
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async void PostEmployeeSkill_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 10, SkillsId = 2, Experience = 3, UserId = "a3" };

            var result = await query.PostEmployeeSkills(newEmployeeSkill);  // async

            Assert.IsType<ActionResult<EmployeeSkills>>(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async void UpdateEmployeeSkill_Put()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 9, SkillsId = 7, Experience = 1, UserId = "a1" };

            var newEmployeeSkillToReturn = new EmployeeSkillsToReturn
            {
                Id = 9,
                SkillsId = 7,
                Experience = 1,
                UserId = "a1",
                Skills = new Skills { Id = 7, Name = "ASP.NET Core", Type = 2 },
                UserInfo = new UserInfo { Id = "a1", UserName = "SarahWest", FirstName = "Sarah", LastName = "West", Email = "sarah@west.com" }
            };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.EmployeeSkills.Local.Where(t => t.Id == 9).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutEmployeeSkills(9, newEmployeeSkill);  // async
            var added = await query.GetEmployeeSkillById(9);  // async

            var addedGoodRequest = Assert.IsType<EmployeeSkillsToReturn>(added.Value);

            Assert.Equal(newEmployeeSkill.Id, added.Value.Id);
            Assert.Equal(newEmployeeSkill.SkillsId, added.Value.SkillsId);
            Assert.Equal(newEmployeeSkill.Experience, added.Value.Experience);
            Assert.Equal(newEmployeeSkill.UserId, added.Value.UserId);
            Assert.Equal(Newtonsoft.Json.JsonConvert.SerializeObject(newEmployeeSkillToReturn), Newtonsoft.Json.JsonConvert.SerializeObject(addedGoodRequest));
            //Assert.Equal(newEmployeeSkillToReturn, addedGoodRequest);
            // not sure why the objects aren't considered to be the same
            //Assert.Equal(newEmployeeSkill, result); // No Content returned so can't check it without changing return value
        }

        [Fact]
        public async void UpdateEmployeeSkill_Put_Adjusted_Value_Of_EmployeeSkill_Already_Added()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 9, SkillsId = 1, Experience = 2, UserId = "a1" };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.EmployeeSkills.Local.Where(t => t.Id == 9).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutEmployeeSkills(9, newEmployeeSkill);  // async
            var added = await query.GetEmployeeSkillById(9);  // async

            Assert.NotEqual(newEmployeeSkill.SkillsId, added.Value.SkillsId); // skill already in db therefore cannot update
            Assert.Equal(7, added.Value.SkillsId); // what is was before trying to update
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Contains("already added to this employee", badRequestResult.Value.ToString());
            Assert.Equal(400, badRequestResult.StatusCode);
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async void UpdateEmployeeSkills_Returns_OK()
        {
            var query = new EmployeeSkillsController(context);

            var newEmployeeSkill = new EmployeeSkills { Id = 9, SkillsId = 7, Experience = 1, UserId = "a1" };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.EmployeeSkills.Local.Where(t => t.Id == 9).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutEmployeeSkills(9, newEmployeeSkill);  // async

            Assert.IsType<NoContentResult>(result);
        }

        
    }
}
