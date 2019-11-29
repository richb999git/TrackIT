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
    public class SoftwaresController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SoftwaresController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Softwares
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Software>>> GetSoftware()
        {
            return await _context.Software.ToListAsync();
        }

        // GET: api/Softwares/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Software>> GetSoftware(int id)
        {
            var software = await _context.Software.FindAsync(id);

            if (software == null)
            {
                return NotFound();
            }

            return software;
        }

        // PUT: api/Softwares/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSoftware(int id, Software software)
        {
            if (id != software.Id)
            {
                return BadRequest();
            }

            _context.Entry(software).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SoftwareExists(id))
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

        // POST: api/Softwares
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Software>> PostSoftware(Software software)
        {
            _context.Software.Add(software);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSoftware", new { id = software.Id }, software);
        }

        // DELETE: api/Softwares/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Software>> DeleteSoftware(int id)
        {
            var software = await _context.Software.FindAsync(id);
            if (software == null)
            {
                return NotFound();
            }

            _context.Software.Remove(software);
            await _context.SaveChangesAsync();

            return software;
        }

        private bool SoftwareExists(int id)
        {
            return _context.Software.Any(e => e.Id == id);
        }
    }
}
