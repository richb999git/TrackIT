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
    public class SkillsContollerTests : UnitTestSetUp
    {

        public SkillsContollerTests()
        {
            var skills = new List<Skills>()
            {
                new Skills { Id = 1, Name = "C#", Type = 1},
                new Skills { Id = 2, Name = "Javascript", Type = 1},
                new Skills { Id = 3, Name = "ASP.NET", Type = 2},
                new Skills { Id = 4, Name = "ASP.NET Core", Type = 2},
                new Skills { Id = 5, Name = "Angular", Type = 2},
            };

            context.Skills.AddRange(skills);
            context.SaveChanges();
        }



        [Fact]
        public async void Check_All_Received()
        {
            var query = new SkillsController(context);
            string sort = "name";
            bool asc = true;
            var result = await query.GetSkills(sort, asc);  // async

            Assert.Equal(5, result.Value.ToList().Count);
            Assert.Equal(5, result.Value.Count());
        }

        [Fact]
        public async void GetAllSkills_Returns_OK()
        {
            var query = new SkillsController(context);
            string sort = "name";
            bool asc = true;
            var result = await query.GetSkills(sort, asc);  // async

            Assert.IsType<ActionResult<IEnumerable<Skills>>>(result);
        }


        [Fact]
        public async void GetAllSkills_Check_Order()
        {
            var query = new SkillsController(context);
            string sort = "name";
            bool asc = true;
            var result = await query.GetSkills(sort, asc);  // async

            Assert.Equal("Angular", result.Value.First().Name);
            Assert.Equal("Javascript", result.Value.Last().Name);
        }

        [Fact]
        public async void GetSkills_Get_Id_2()
        {
            var query = new SkillsController(context);

            var result = await query.GetSkills(2);  // async

            Assert.Equal("Javascript", result.Value.Name);
        }

        [Fact]
        public async void GetSkills_Returns_OK()
        {
            var query = new SkillsController(context);

            var result = await query.GetSkills(2);  // async

            Assert.IsType<ActionResult<Skills>>(result);
        }

        [Fact]
        public async void DeleteSkills_Delete_Id_3()
        {
            var query = new SkillsController(context);
            
            var result = await query.DeleteSkills(3);  // async

            Assert.Equal("ASP.NET", result.Value.Name);
        }

        [Fact]
        public async void DeleteSkills_Returns_OK()
        {
            var query = new SkillsController(context);

            var result = await query.DeleteSkills(3);  // async

            Assert.IsType<ActionResult<Skills>>(result);
        }


        [Fact]
        public async void PostSkills_Add()
        {
            var query = new SkillsController(context);

            var newSkill = new Skills { Id = 6, Name = "React", Type = 2 };

            var result = await query.PostSkills(newSkill);  // async
            var added = await query.GetSkills(6);  // async

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result.Result);
            var addedGoodRequest = Assert.IsType<Skills>(added.Value);

            Assert.Equal(newSkill, added.Value);
            Assert.Equal(newSkill, resultGoodRequest.Value);
            Assert.Equal(newSkill, addedGoodRequest);
        }

        [Fact]
        public async void PostSkill_Returns_OK()
        {
            var query = new SkillsController(context);

            var newSkill = new Skills { Id = 6, Name = "React", Type = 2 };

            var result = await query.PostSkills(newSkill);  // async

            Assert.IsType<ActionResult<Skills>>(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }

        [Fact]
        public async void UpdateSkill_Put()
        {
            var query = new SkillsController(context);

            var newSkill = new Skills { Id = 3, Name = "ASP.NET Framework", Type = 2 };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Skills.Local.Where(t => t.Id == 3).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutSkills(3, newSkill);  // async
            var added = await query.GetSkills(3);  // async

            var addedGoodRequest = Assert.IsType<Skills>(added.Value);

            Assert.Equal(newSkill.Name, added.Value.Name);
            Assert.Equal(newSkill, added.Value);
            Assert.Equal(newSkill, addedGoodRequest);
            //Assert.Equal(newSkill, result); // No Content returned so can't check it without changing return value
        }

        [Fact]
        public async void UpdateSkills_Returns_OK()
        {
            var query = new SkillsController(context);

            var newSkill = new Skills { Id = 3, Name = "ASP.NET Framework", Type = 2 };

            // https://stackoverflow.com/questions/36856073/the-instance-of-entity-type-cannot-be-tracked-because-another-instance-of-this-t/42475617
            var local = context.Skills.Local.Where(t => t.Id == 3).FirstOrDefault();
            if (local != null) context.Entry(local).State = EntityState.Detached; // only needed for xUnit testing

            var result = await query.PutSkills(3, newSkill);  // async

            Assert.IsType<NoContentResult>(result);
        }

      
    }
}
