using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackIT.Data;
using TrackIT.Models;

namespace TrackIT.Controllers
{
    public class CasesToReturn
    {
        public int Id { get; set; }
        public int SoftwareId { get; set; }
        public Software Software { get; set; }
        public string UserId { get; set; }
        public UserInfo UserInfo { get; set; }     // particular to this view class - replacing applicationUser so we just get a subset excluding passwords 
        public string ContactId { get; set; }
        public UserInfo ContactInfo { get; set; }  // particular to this view class - replacing applicationUser so we just get a subset excluding passwords
        public string Title { get; set; }
        public string Description { get; set; }
        public int Status { get; set; }
        public DateTime? DateOpened { get; set; }
        public DateTime? DateAssigned { get; set; }
        public DateTime? DateAwaitApproval { get; set; }
        public DateTime? DateApproved { get; set; }
        public DateTime? DateApplied { get; set; }
        public DateTime? DateCompleted { get; set; }
        public DateTime? Deadline { get; set; }
        public float? TimeSpentHours { get; set; }
        public float? EstimatedTimeHours { get; set; }
        public string StaffAssigned { get; set; } // comma delimited string
        public string FilesUploaded { get; set; } // comma delimited string of references to files stored in Cloudify
        public int Type { get; set; } // enum Type as an int
        public int UrgencyLevel { get; set; }
    }

    public class UserInfo
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public CasesController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }


        // Get cases in user section of site (1 = active, 0 = all). Software filter based on id - 0 = all
        [Route("/api/CasesUser")]
        // GET: api/CasesUser?caseFilter=1&softwareFilter=0&sort=id&sortAsc=true
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CasesToReturn>>> GetCasesUser(int caseFilter, int softwareFilter, string sort, bool sortAsc)
        {
            int statusFilter = caseFilter == 1 ? 7 : 8;
            // Filter just user's cases (or later maybe all their company's cases)
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var cases = await _context.Cases
                .Include(c => c.Software)
                .Include(c => c.User)
                .Select(c => new CasesToReturn
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    Status = c.Status,
                    Type = c.Type,
                    DateOpened = c.DateOpened,
                    DateCompleted = c.DateCompleted,
                    UrgencyLevel = c.UrgencyLevel,
                    Software = c.Software,
                    SoftwareId = c.SoftwareId,
                    UserInfo = new UserInfo
                    {
                        UserName = c.User.UserName,
                        UserId = c.User.Id,
                        FirstName = c.User.FirstName,
                        LastName = c.User.LastName,
                        Email = c.User.Email
                    },
                    ContactInfo = new UserInfo
                    {
                        UserName = c.Contact.UserName,
                        UserId = c.Contact.Id,
                        FirstName = c.Contact.FirstName,
                        LastName = c.Contact.LastName,
                        Email = c.Contact.Email
                    }
                })
                .Where(x => x.UserInfo.UserId == userId)
                .Where(c => c.Status < statusFilter)
                .Where(c => softwareFilter != 0 ? c.SoftwareId == softwareFilter : 1==1)
                .ToListAsync();

            return SortCases(sort, sortAsc, cases).ToList();
        }


        // Get case list in support section of site (1 = active, 0 = all). Software filter based on id - 0 = all. Type filter - 0 = all
        [Authorize(Policy = "RequireEmployeeRoleClaim")]
        [Route("/api/CasesSupport")]
        // GET: api/CasesSupport?caseFilter=1&softwareFilter=0&typeFilter=0&sort=id&sortAsc=true
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CasesToReturn>>> GetCasesSupport(int caseFilter, int softwareFilter, int typeFilter, string sort, bool sortAsc)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var IsManager = User.HasClaim(ClaimTypes.Role, "manager");
            var IsAdmin = User.HasClaim(ClaimTypes.Role, "admin");

            int statusFilter = caseFilter == 1 ? 7 : 8; // status 7 is completed

            var cases = await _context.Cases
                .Include(c => c.Software)
                .Include(c => c.User)
                .Select(c => new CasesToReturn
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    DateOpened = c.DateOpened,
                    DateAssigned = c.DateAssigned,
                    DateAwaitApproval = c.DateAwaitApproval,
                    DateApproved = c.DateApproved,
                    DateApplied = c.DateApplied,
                    DateCompleted = c.DateCompleted,
                    Deadline = c.Deadline,
                    TimeSpentHours = c.TimeSpentHours,
                    EstimatedTimeHours = c.EstimatedTimeHours,
                    StaffAssigned = c.StaffAssigned,
                    FilesUploaded = c.FilesUploaded,
                    Status = c.Status,
                    Type = c.Type,
                    UrgencyLevel = c.UrgencyLevel,
                    Software = c.Software,
                    SoftwareId = c.SoftwareId,
                    UserId = c.UserId,
                    UserInfo = new UserInfo
                    {
                        UserName = c.User.UserName,
                        UserId = c.User.Id,
                        FirstName = c.User.FirstName,
                        LastName = c.User.LastName,
                        Email = c.User.Email
                    },
                    ContactId = c.ContactId,
                    ContactInfo = new UserInfo
                    {
                        UserName = c.Contact.UserName,
                        UserId = c.Contact.Id,
                        FirstName = c.Contact.FirstName,
                        LastName = c.Contact.LastName,
                        Email = c.Contact.Email
                    }
                })
                .Where(c => c.Status < statusFilter)
                .Where(c => typeFilter != 0 ? c.Type == typeFilter : 1==1)
                .Where(c => softwareFilter != 0 ? c.SoftwareId == softwareFilter : 1 == 1)
                .Where(c => (!IsManager && !IsAdmin) ? (c.ContactId == userId || (c.StaffAssigned != null && c.StaffAssigned.Contains(userId))) : 1==1)
                .ToListAsync();

                // Last where tests if role of user is not Manager and is not an Admin (i.e. just employee)
                // then filter cases assigned to employee (as contact or developer)

            return SortCases(sort, sortAsc, cases).ToList();
        }

        // Used in above methods to get list of cases
        private IEnumerable<CasesToReturn> SortCases(string sort, bool sortAsc, IEnumerable<CasesToReturn> cases)
        { 
            switch (sort)
            {
                case "deadline":
                    if (!sortAsc) cases = cases.OrderBy(c => c.Deadline).ToList();
                    else cases = cases.OrderByDescending(c => c.Deadline).ToList();
                    break;
                case "dateOpened":
                    if (sortAsc) cases = cases.OrderBy(c => c.DateOpened).ToList();
                    else cases = cases.OrderByDescending(c => c.DateOpened).ToList();
                    break;
                case "urgency":
                    if (!sortAsc) cases = cases.OrderBy(c => c.UrgencyLevel).ToList();
                    else cases = cases.OrderByDescending(c => c.UrgencyLevel).ToList();
                    break;
                case "status":
                    if (sortAsc) cases = cases.OrderBy(c => c.Status).ToList();
                    else cases = cases.OrderByDescending(c => c.Status).ToList();
                    break;
                case "case":
                    if (sortAsc) cases = cases.OrderBy(c => c.Id).ToList();
                    else cases = cases.OrderByDescending(c => c.Id).ToList();
                    break;
                case "user":
                    if (sortAsc) cases = cases.OrderBy(c => c.UserInfo.LastName).ToList();
                    else cases = cases.OrderByDescending(c => c.UserInfo.LastName).ToList();
                    break;
                case "contact":
                    if (sortAsc) cases = cases.OrderBy(c => c.ContactInfo.LastName).ToList();
                    else cases = cases.OrderByDescending(c => c.ContactInfo.LastName).ToList();
                    break;
                default:     
                    // no sort, i.e. by case
                    break;
            }
            
            return cases;
        }


        // Used for User and Support - may need to change if I want to restrict User access
        // GET: api/Case/5 
        [Route("/api/Case/{id}")]
        [HttpGet("{id}")]
        public async Task<ActionResult<CasesToReturn>> GetCase(int id)
        {
            //var cases = await _context.Cases.FindAsync(id);
            var cases = await _context.Cases
                .Include(c => c.Software)
                .Include(c => c.User)
                .Select(c => new CasesToReturn
                {
                    Id = c.Id,
                    Title = c.Title,
                    Description = c.Description,
                    DateOpened = c.DateOpened,
                    DateAssigned = c.DateAssigned,
                    DateAwaitApproval = c.DateAwaitApproval,
                    DateApproved = c.DateApproved,
                    DateApplied = c.DateApplied,
                    DateCompleted = c.DateCompleted,
                    Deadline = c.Deadline,
                    TimeSpentHours = c.TimeSpentHours,
                    EstimatedTimeHours = c.EstimatedTimeHours,
                    StaffAssigned = c.StaffAssigned,
                    FilesUploaded = c.FilesUploaded,
                    Status = c.Status,
                    Type = c.Type,
                    UrgencyLevel = c.UrgencyLevel,
                    Software = c.Software,
                    SoftwareId = c.SoftwareId,
                    UserId = c.UserId,
                    UserInfo = new UserInfo
                    {
                        UserName = c.User.UserName,
                        UserId = c.User.Id,
                        FirstName = c.User.FirstName,
                        LastName = c.User.LastName,
                        Email = c.User.Email
                    },
                    ContactId = c.ContactId,
                    ContactInfo = new UserInfo
                    {
                        UserName = c.Contact.UserName,
                        UserId = c.Contact.Id,
                        FirstName = c.Contact.FirstName,
                        LastName = c.Contact.LastName,
                        Email = c.Contact.Email
                    }
                })
                .FirstOrDefaultAsync(x => x.Id == id);

            if (cases == null)
            {
                return NotFound();
            }

            return cases;
        }


        // Just trying to update case with StaffAssigned at the moment. Will probably have to change for other updates or create a new method ********
        // PUT: api/Cases/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCases(int id, 
            [Bind("StaffAssigned", "ContactId", "Status", "EstimatedTimeHours", "TimeSpentHours",
            "DateOpened", "DateAssigned", "Deadline", "DateAwaitApproval", "DateApproved", "DateApplied", "DateCompleted")] Cases cases)
        {
            if (id != cases.Id)
            {
                return BadRequest();
            }

            _context.Entry(cases).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CasesExists(id))
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

        
        // POST: api/Cases
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Cases>> PostCases(
            [Bind("UserId", "SoftwareId", "Type", nameof(Cases.Title), "Description", "Status", "UrgencyLevel", "DateOpened")] Cases cases)
        {
            cases.UserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            cases.Status = 1;
            cases.DateOpened = DateTime.Now;
            _context.Cases.Add(cases);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCases", new { id = cases.Id }, cases);
        }

        // Not needed unless Admin is allowed to delete completed cases that are more than 6 months old?
        // DELETE: api/Cases/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Cases>> DeleteCases(int id)
        {
            var cases = await _context.Cases.FindAsync(id);
            if (cases == null)
            {
                return NotFound();
            }

            _context.Cases.Remove(cases);
            await _context.SaveChangesAsync();

            return cases;
        }

        private bool CasesExists(int id)
        {
            return _context.Cases.Any(e => e.Id == id);
        }
    }
}
