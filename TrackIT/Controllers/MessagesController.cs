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
    public class MessagesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MessagesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // need to either return all messages for a case not ALL messages
        // GET: api/Messages/5
        [Route("/api/MessagesInCase/{caseId}")]
        [HttpGet("{caseId}")]
        public async Task<ActionResult<IEnumerable<Messages>>> GetMessagesInCase(int caseId)
        {
            ActionResult<IEnumerable <Messages>> messages;

            if (caseId == 0) // use 0 if you want all messages - could be huge though in real world app
            {
                messages = await _context.Messages.ToListAsync();               
            }
            else
            {
                messages = await _context.Messages
                    .Where(m => m.Case.Id == caseId)
                    .ToListAsync();
            }    

            if(messages == null)
            {
                return NotFound();
            }

            return messages;
        }
       

        // POST: api/Messages
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [HttpPost]
        public async Task<ActionResult<Messages>> PostMessages([Bind("Comment", "CaseId", "UserId", "IsEmployee", "TimeStamp")] Messages messages)
        {
            messages.TimeStamp = DateTime.Now;
            _context.Messages.Add(messages);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMessages", new { id = messages.Id }, messages);
        }

        // Not implemented but could be
        // DELETE: api/Messages/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<Messages>> DeleteMessages(int id)
        {
            var messages = await _context.Messages.FindAsync(id);
            if (messages == null)
            {
                return NotFound();
            }

            _context.Messages.Remove(messages);
            await _context.SaveChangesAsync();

            return messages;
        }

        private bool MessagesExists(int id)
        {
            return _context.Messages.Any(e => e.Id == id);
        }
    }
}
