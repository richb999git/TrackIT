﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackIT.Data;
using TrackIT.Models;
using static TrackIT.Controllers.UsersController;

namespace TrackIT.Controllers
{
    public class EmployeeSkillsToReturn
    {
        public int Id { get; set; }
        public int SkillsId { get; set; }
        public virtual Skills Skills { get; set; } // Navigation property. It also adds UserId field automatically (FK)
        public string UserId { get; set; }
        public virtual UserInfo UserInfo { get; set; } // Navigation property. It also adds UserId field automatically (FK)
        public int Experience { get; set; } // enum? 1 = Excellent, 2 = Good, 3 = Beginner, 4 = None

    }

    //public class PaginatedListEmployeeSkills: Paginated
    //{
    //    public List<EmployeeSkillsToReturn> EmployeesSkills { get; set; } 

    //    public PaginatedListEmployeeSkills(List<EmployeeSkillsToReturn> employeeSkills, int pageIndex, int pageSize, int count) 
    //    {
    //        PageIndex = pageIndex;
    //        PageSize = pageSize;
    //        TotalPages = (int)Math.Ceiling(count / (double)pageSize);
    //        EmployeesSkills = employeeSkills; 
    //    }
    //}



    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeSkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public EmployeeSkillsController(ApplicationDbContext context)
        {
            _context = context;
        }

        

        // GET: api/EmployeeSkills
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeSkills>>> GetEmployeeSkills()
        {
            return await _context.EmployeeSkills.ToListAsync();
        }


        // get a skill by id (with limited user info)
        // GET: api/EmployeeSkills/5
        [Route("/api/EmployeeSkillById/{id}")]
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeSkillsToReturn>> GetEmployeeSkillById(int id)
        {
            var employeeSkills = await _context.EmployeeSkills
                                               .Include(s => s.Skills)
                                               .Include(s => s.User)
                                               .FirstOrDefaultAsync(u => u.Id == id);

            if (employeeSkills == null)
            {
                return NotFound();
            }
                       
            var employeeSkillsToReturn = new EmployeeSkillsToReturn
                                            {
                                                Id = employeeSkills.Id,
                                                Experience = employeeSkills.Experience,
                                                SkillsId = employeeSkills.SkillsId,
                                                Skills = employeeSkills.Skills,
                                                UserId = employeeSkills.UserId,
                                                UserInfo = new UserInfo
                                                {
                                                    UserName = employeeSkills.User.UserName,
                                                    Id = employeeSkills.User.Id,
                                                    FirstName = employeeSkills.User.FirstName,
                                                    LastName = employeeSkills.User.LastName,
                                                    Email = employeeSkills.User.Email,
                                                }
                                            };

            return employeeSkillsToReturn;
        }


        

        // get all the employees with a skill (all if users array is null)
        // GET: api/AllSkillsOfAllEmployees?user=hjgftfhtf&user=eriuege&user=sdvnurgeh etc
        //[Route("/api/AllSkillsOfAllEmployeesPage")]
        //[Authorize(Policy = "RequireAdminRoleClaim")]
        //[HttpGet]
        //public async Task<ActionResult<PaginatedListEmployeeSkills>> GetAllSkillsOfAllEmployeesPage([FromQuery]string[] users, int skill, int pageIndex)
        //{
        //    //skill = 1; // c# temporary

        //    var usersWithSkills = await _context.EmployeeSkills
        //                                       .Include(s => s.Skills)
        //                                       .Select(s => new EmployeeSkillsToReturn
        //                                       {
        //                                           Id = s.Id,
        //                                           Experience = s.Experience,
        //                                           SkillsId = s.SkillsId,
        //                                           Skills = s.Skills,
        //                                           UserId = s.UserId,
        //                                           UserInfo = new UserInfo
        //                                           {
        //                                               UserName = s.User.UserName,
        //                                               Id = s.User.Id,
        //                                               FirstName = s.User.FirstName,
        //                                               LastName = s.User.LastName,
        //                                               Email = s.User.Email
        //                                           }
        //                                       })
        //                                       .Where(s => users != null ? users.Contains(s.UserId) : 1 == 1)
        //                                       .Where(s => skill != 0 ? s.SkillsId == skill : 1 == 1)
        //                                       .ToListAsync();

        //    if (usersWithSkills == null)
        //    {
        //        return NotFound();
        //    }

        //    // usersWithSkills = SortUsersWithSkills(sort, sortAsc, usersWithSkills).ToList(); // later?
        //    var count = usersWithSkills.Count;
        //    var pageSize = 10; // this COULD/SHOULD to be passed in..........
        //    usersWithSkills = usersWithSkills.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList(); 
        //    return new PaginatedListEmployeeSkills(usersWithSkills, pageIndex, pageSize, count);

        //}


        // get all the skills for an array of users
        // GET: api/AllSkillsOfAllEmployees?user=hjgftfhtf&user=eriuege&user=sdvnurgeh etc
        [Route("/api/AllSkillsOfAllEmployees")]
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeSkillsToReturn>>> GetAllSkillsOfAllEmployees([FromQuery]string[] users, int skill)
        {
            //skill = 1; // c# temporary

            var employeeSkills = await _context.EmployeeSkills
                                               .Include(s => s.Skills)
                                               .Select(s => new EmployeeSkillsToReturn
                                               {
                                                   Id = s.Id,
                                                   Experience = s.Experience,
                                                   SkillsId = s.SkillsId,
                                                   Skills = s.Skills,
                                                   UserId = s.UserId,
                                                   UserInfo = new UserInfo
                                                   {
                                                       UserName = s.User.UserName,
                                                       Id = s.User.Id,
                                                       FirstName = s.User.FirstName,
                                                       LastName = s.User.LastName,
                                                       Email = s.User.Email
                                                   }
                                               })
                                               .Where(s => users.Contains(s.UserId))
                                               .Where(s => skill != 0 ? s.SkillsId == skill : 1 == 1)
                                               .ToListAsync();

            if (employeeSkills == null)
            {
                return NotFound();
            }

            return employeeSkills;
        }


        // get all the skills for a user
        // GET: api/EmployeeSkills/5
        [Route("/api/AllEmployeeSkills/{userId}")]
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<EmployeeSkillsToReturn>>> GetAllEmployeeSkills(string userId)
        {
            var employeeSkills = await _context.EmployeeSkills
                                               .Include(s => s.Skills)
                                               .Select(s => new EmployeeSkillsToReturn
                                               {
                                                   Id = s.Id,
                                                   Experience = s.Experience,
                                                   SkillsId = s.SkillsId,
                                                   Skills = s.Skills,
                                                   UserId = s.UserId,
                                                   UserInfo = new UserInfo
                                                   {
                                                       UserName = s.User.UserName,
                                                       Id = s.User.Id,
                                                       FirstName = s.User.FirstName,
                                                       LastName = s.User.LastName,
                                                       Email = s.User.Email
                                                   }
                                               })
                                               .Where(s => s.UserId == userId)
                                               .ToListAsync();

            if (employeeSkills == null)
            {
                return NotFound();
            }

            return employeeSkills;
        }

        // PUT: api/EmployeeSkills/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeSkills(int id, EmployeeSkills employeeSkills)
        {
            if (id != employeeSkills.Id)
            {
                return BadRequest();
            }

            var e = await _context.EmployeeSkills
                                  .AsNoTracking()
                                  .Include(s => s.Skills)
                                  .FirstOrDefaultAsync(x => x.SkillsId == employeeSkills.SkillsId && x.UserId == employeeSkills.UserId);

            if (e != null && e.Id != id)
            {
                return BadRequest("Skill of " + e.Skills.Name + " already added to this employee.");
            }

            _context.Entry(employeeSkills).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeSkillsExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/EmployeeSkills
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpPost]
        public async Task<ActionResult<EmployeeSkills>> PostEmployeeSkills(EmployeeSkills employeeSkills)
        {
            var e = await _context.EmployeeSkills
                                  .Include(s => s.Skills)
                                  .FirstOrDefaultAsync(x => x.SkillsId == employeeSkills.SkillsId && x.UserId == employeeSkills.UserId);

            if (e != null)
            {
                return BadRequest("Skill of " + e.Skills.Name + " already added to this employee.");
            }

            _context.EmployeeSkills.Add(employeeSkills);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEmployeeSkills", new { id = employeeSkills.Id }, employeeSkills);
        }

        // DELETE: api/EmployeeSkills/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<EmployeeSkills>> DeleteEmployeeSkills(int id)
        {
            var employeeSkills = await _context.EmployeeSkills.FindAsync(id);
            if (employeeSkills == null)
            {
                return NotFound();
            }

            _context.EmployeeSkills.Remove(employeeSkills);
            await _context.SaveChangesAsync();

            return employeeSkills;
        }

        private bool EmployeeSkillsExists(int id)
        {
            return _context.EmployeeSkills.Any(e => e.Id == id);
        }
    }
}
