using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
            public string FirstName { get; set; }
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


        //public async Task<ActionResult<PaginatedList>> GetUsersForClaimAsync(new Claim(ClaimTypes.Role, role), int pageIndex)
        //public async Task<ActionResult<PaginatedList>> GetUsersByRole(string role, int progSkillsFilter, int softwareFilter, string sort, bool sortAsc, int pageIndex)
        [Route("/api/UsersByRole/{role}")]
        // GET: api/UsersByRole/sdfgsdf?pageIndex=1
        [HttpGet("{role}")]
        //public async Task<IEnumerable<UserInfo>> GetUsersByRole(string role)
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

            // need to create required SortUsers method
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
                    // no sort, i.e. by case
                    break;
            }

            return users;
        }



        [Route("/api/User/{id}")]
        //GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserInfo>> GetUser(string id) 
        {
            var user = await _userManager.FindByIdAsync(id); 
            //var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id); 

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

        [Route("/api/UserDetails/{id}")]
        // PUT: api/User/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
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

        // No need fo a delete user. Disable is better but I won't implement.

        private bool UserExists(string id) // User
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
