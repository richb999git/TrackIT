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

        [Route("/api/Users/{role}")]
        // GET: api/Users
        [HttpGet("{role}")]
        //public async Task<ActionResult<IEnumerable<Software>>> GetVsers() ////////// Users - ok
        //public async Task<ActionResult<IList<ApplicationUser>>> GetVsers() ////////// Users
        public async Task<IEnumerable<UserInfo>> GetUsers(string role) ////////// Users - ok
        {
            //return await _context.Users.ToListAsync(); ////////// Users
            //var users =  await _userManager.GetUsersInRoleAsync("employee");

            var users = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, role));

            var userInfo = users
                .Select(c => new UserInfo               
                {
                    UserName = c.UserName,
                    UserId = c.Id,
                    FirstName = c.FirstName,
                    LastName = c.LastName,
                    Email = c.Email
                    
                });
            //.ToListAsync();

            return userInfo;
        }

        // GET: api/Users
        //[HttpGet]
        ////public async Task<ActionResult<IEnumerable<Software>>> GetVsers() ////////// Users - ok
        ////public async Task<IEnumerable<ApplicationUser>> GetVsers() ////////// Users
        //public async Task<ActionResult<IList<ApplicationUser>>> GetVsers() ////////// Users
        //{
        //    return await _context.Users.ToListAsync(); ////////// Users
        //    //var users =  await _userManager.GetUsersInRoleAsync("employee");
        //    //var usersC = await _userManager.GetUsersForClaimAsync(new Claim(ClaimTypes.Role, "employee"));
        //    //return usersC;
        //}

        // GET: api/Users/5
        //[HttpGet("{id}")]
        //public async Task<ActionResult<Software>> GetUser(int id) ////////// Users
        //{
        //    var user = await _context.Software.FindAsync(id); ////////// Users

        //    if (user == null) 
        //    {
        //        return NotFound();
        //    }

        //    return user; 
        //}

        // PUT: api/Users/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSoftware(int id, Software software)////////// Users
        {
            if (id != software.Id) ////////// Users
            {
                return BadRequest();
            }

            _context.Entry(software).State = EntityState.Modified; ////////// Users

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SoftwareExists(id)) ////////// Users
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

        // POST: api/Users ******************* not sure I want this!!!!
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        //[HttpPost]
        //public async Task<ActionResult<Software>> PostSoftware(Software software)
        //{
        //    _context.Software.Add(software);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetSoftware", new { id = software.Id }, software);
        //}

        // DELETE: api/Users/5 ******************* not sure I want this!!!!
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<Software>> DeleteSoftware(int id)
        //{
        //    var software = await _context.Software.FindAsync(id);
        //    if (software == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Software.Remove(software);
        //    await _context.SaveChangesAsync();

        //    return software;
        //}

        private bool SoftwareExists(int id) // User
        {
            return _context.Software.Any(e => e.Id == id);
        }
    }
}
