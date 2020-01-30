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
    public class UserContollerTests : UnitTestSetUp
    {

        public UserContollerTests()
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



        
        // Can't test GetUsersByRoleBySkill without using UserManager and claims/roles - too complex for now

        // Can't test GetUsersByRole without using UserManager and claims/roles - too complex for now

        // Can't test GetUser without using UserManager and claims/roles - too complex for now

        // No Posting users in this controller

        // Can't test updating user without using UserManager and claims/roles - too complex for now

        // No Deleting users

    }
}
