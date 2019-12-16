using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackIT.Data;
using TrackIT.Models;

namespace TrackIT.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SkillsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SkillsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Skills?sort=id&sortAsc=true
        [Authorize(Policy = "RequireEmployeeRoleClaim")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Skills>>> GetSkills(string sort, bool sortAsc)
        {
            var skills = await _context.Skills.ToListAsync();
            skills = SortSkills(sort, sortAsc, skills).ToList();
            return skills;
        }

        // ready for more properties to be sorted on
        private IEnumerable<Skills> SortSkills(string sort, bool sortAsc, IEnumerable<Skills> skills)
        {
            switch (sort)
            {
                case "id":
                    if (sortAsc) skills = skills.OrderBy(u => u.Id).ToList();
                    else skills = skills.OrderByDescending(u => u.Id).ToList();
                    break;
                case "name":
                    if (sortAsc) skills = skills.OrderBy(u => u.Name).ToList();
                    else skills = skills.OrderByDescending(u => u.Name).ToList();
                    break;
                case "type":
                    if (sortAsc) skills = skills.OrderBy(u => u.Type).ToList();
                    else skills = skills.OrderByDescending(u => u.Type).ToList();
                    break;
                default:
                    // no sort, i.e. by case
                    break;
            }

            return skills;
        }


        // GET: api/Skill/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Skills>> GetSkills(int id)
        {
            var skill = await _context.Skills.FindAsync(id);

            if (skill == null)
            {
                return NotFound();
            }

            return skill;
        }

        // PUT: api/Skills/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSkills(int id, Skills skill)
        {
            if (id != skill.Id)
            {
                return BadRequest();
            }

            _context.Entry(skill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SkillsExists(id))
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

        // POST: api/Skills
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpPost]
        public async Task<ActionResult<Skills>> PostSkills(Skills skill)
        {
            _context.Skills.Add(skill);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSkills", new { id = skill.Id }, skill);
        }

        // Will delete related data, wwhich is what I want (if user (admin only) wants
        // DELETE: api/Skills/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Skills>> DeleteSkills(int id)
        {
            var skill = await _context.Skills.FindAsync(id);
            if (skill == null)
            {
                return NotFound();
            }

            _context.Skills.Remove(skill);
            await _context.SaveChangesAsync();

            return skill;
        }

        private bool SkillsExists(int id)
        {
            return _context.Skills.Any(e => e.Id == id);
        }
    }
}
