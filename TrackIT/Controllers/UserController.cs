using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackIT.Data;
using TrackIT.Models;

namespace TrackIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public UsersController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public class UserInfo
        {
            public string Id { get; set; }
            public string UserName { get; set; }

            [Required]
            public string FirstName { get; set; }

            [StringLength(40, MinimumLength = 2)]
            [Required]
            public string LastName { get; set; }
            public string Email { get; set; }
            public bool? IsManager { get; set; } = null;
        }

        public class PaginatedListUsers : Paginated
        {
            public List<UserInfo> Users { get; set; }

            public PaginatedListUsers(List<UserInfo> users, int pageIndex, int pageSize, int count)
            {
                PageIndex = pageIndex;
                PageSize = pageSize;
                TotalPages = (int)Math.Ceiling(count / (double)pageSize);
                Users = users;
            }
        }


        // If I wanted to implement a sort I would need to get paginated employees with a certain skill..
        // Couldn't use EmployeeSkill Controller to get paginated employees with a certain skill mainly because it
        // would require being able to create dynamic properties for each skill added (which I can do in Javascript) 
        // but I'm not sure how to do in c#. Sorting would be tricky as well.
        // Therefore it was simpler to get the employees from the User Controller and process further in Javascript
        // See in Users Controller: UsersByRoleBySkill

        // Get all users in a role with a particular skill (or all skills)
        // GET: api/UsersByRole/sdfgsdf?skill=0&sort=&sortAsc=&pageIndex=1
        [Authorize(Policy = "RequireManagerRoleClaim")]
        [Route("/api/UsersByRoleBySkill/{role}")]
        [HttpGet("{role}")]
        public async Task<PaginatedListUsers> GetUsersByRoleBySkill(string role, int skill, string sort, bool sortAsc, int pageIndex, string skillSearch  )
        {
            var managers = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, "manager"));
            var users = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, role));

            if (skillSearch == null || skillSearch == "null") skillSearch = "";
            var allEmployeeSkills = await _context.EmployeeSkills.Where(es => skill != 0 ? es.SkillsId == skill : 1 == 1).ToListAsync();
            var allEmployeeSkillsSearch = await _context.EmployeeSkills.Where(es => skillSearch != null ? es.Skills.Name.Contains(skillSearch) : 1 == 1).ToListAsync();

            var userInfo = users
                .Select(c => new UserInfo
                {
                    UserName = c.UserName,
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    IsManager = managers.Contains(c)
                })
                .Where(c => skillSearch != "" ? allEmployeeSkillsSearch.Any(es => c.Id == es.UserId) : 1 == 1) // where employee has a skill (via search) in allEmployeeSkills
                .Where(c => skill != 0 ? allEmployeeSkills.Any(es => c.Id == es.UserId) : 1 == 1); // where employee has a skill(via filter) in allEmployeeSkills

            userInfo = SortUsers(sort, sortAsc, userInfo).ToList();
            var count = userInfo.Count();
            var pageSize = 10; // this COULD/SHOULD to be passed in..........
            userInfo = userInfo.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            return new PaginatedListUsers(userInfo.ToList(), pageIndex, pageSize, count);
        }


        // Get all users in a role
        // GET: api/UsersByRole/sdfgsdf?&sort=&sortAsc=&pageIndex=1
        [Authorize(Policy = "RequireManagerRoleClaim")]
        [Route("/api/UsersByRole/{role}")]
        [HttpGet("{role}")]
        public async Task<PaginatedListUsers> GetUsersByRole(string role, string sort, bool sortAsc, int pageIndex)
        {
            var managers = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, "manager"));
            var users = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, role));

            var userInfo = users
                .Select(c => new UserInfo
                {
                    UserName = c.UserName,
                    Id = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email,
                    IsManager = managers.Contains(c)
                });

            userInfo = SortUsers(sort, sortAsc, userInfo).ToList();
            var count = userInfo.Count();
            var pageSize = 10; // this COULD/SHOULD to be passed in..........
            userInfo = userInfo.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();           
            return new PaginatedListUsers(userInfo.ToList(), pageIndex, pageSize, count); 
        }


        // ready for more properties to be sorted on
        private IEnumerable<UserInfo> SortUsers(string sort, bool sortAsc, IEnumerable<UserInfo> users)
        {
            switch (sort)
            {
                case "name":
                    if (sortAsc) users = users.OrderBy(u => u.LastName).ToList();
                    else users = users.OrderByDescending(u => u.LastName).ToList();
                    break;
                default:
                    // no sort, i.e. by id
                    break;
            }

            return users;
        }


        //GET: api/User/5
        [Authorize(Policy = "RequireEmployeeRoleClaim")]
        [Route("/api/User/{id}")]
        [HttpGet("{id}")]
        public async Task<ActionResult<UserInfo>> GetUser(string id) 
        {
            var user = await _userManager.FindByIdAsync(id); 

            if (user == null)
            {
                return NotFound();
            }
            var managers = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, "manager"));

            var userInfo = new UserInfo
            {
                UserName = user.UserName,
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                IsManager = managers.Contains(user)
            };

            return userInfo;
        }

        // Update user info
        // PUT: api/User/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [Route("/api/UserDetails/{id}")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, [Bind("FirstName", "LastName", "IsManager")] UserInfo userInput)
        {
            if (id != userInput.Id)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound($"Unable to load user with ID '{id}'.");
            }

            user.FirstName = userInput.FirstName;
            user.LastName = userInput.LastName;
            
            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var isInManagerRole = roles.Contains("manager");
                var claims = await _userManager.GetClaimsAsync(user);
                var hasManagerClaim = claims.FirstOrDefault(c => c.Value=="manager") == null ? false: true;
                if (isInManagerRole != hasManagerClaim) return BadRequest();

                if (userInput.IsManager == true)
                {
                    if (!isInManagerRole)
                    {
                        await _userManager.AddToRoleAsync(user, "manager");
                        await _userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, "manager"));
                    }
                }
                else
                {
                    if (isInManagerRole)
                    {
                        await _userManager.RemoveFromRoleAsync(user, "manager");
                        await _userManager.RemoveClaimAsync(user, new Claim(ClaimTypes.Role, "manager"));
                    }
                }
            }
            else
            {
                if (!UserExists(id)) 
                {
                    return NotFound();
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                }
            }

            return NoContent();
        }

        // No need for a delete user. Disable is better but I won't implement.

        private bool UserExists(string id) // User
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
