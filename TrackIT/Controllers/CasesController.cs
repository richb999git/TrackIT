using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TrackIT.Data;
using TrackIT.Models;

namespace TrackIT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CasesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CasesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cases
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cases>>> GetCases()
        {
            return await _context.Cases.ToListAsync();
        }

        // GET: api/Cases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cases>> GetCases(int id)
        {
            var cases = await _context.Cases.FindAsync(id);

            if (cases == null)
            {
                return NotFound();
            }

            return cases;
        }

        // PUT: api/Cases/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCases(int id, Cases cases)
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
        public async Task<ActionResult<Cases>> PostCases(Cases cases)
        {
            _context.Cases.Add(cases);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCases", new { id = cases.Id }, cases);
        }

        // DELETE: api/Cases/5
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
