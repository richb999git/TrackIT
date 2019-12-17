using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using TrackIT.Data;
using TrackIT.Models;
using TrackIT.Settings;

namespace TrackIT.Controllers
{
    public class FileUploadsCreate
    {
        public string URL { get; set; }
        public IFormFile File { get; set; }

        [StringLength(50, MinimumLength = 2)]
        [Required]
        public string Description { get; set; }
        public DateTime? TimeStamp { get; set; }
        public string PublicId { get; set; }
        public int CaseId { get; set; }

        public FileUploadsCreate()
        {
            TimeStamp = DateTime.Now;
        }
    }

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FileUploadsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public FileUploadsController(ApplicationDbContext context, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _context = context;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        // Get upload details for a case. No need to return all upload details
        // GET: api/FileUploadsInCase/{caseId}
        [Route("/api/FileUploadsInCase/{caseId}")]
        [HttpGet("{caseId}")]
        public async Task<ActionResult<IEnumerable<FileUploads>>> GetFileUploadsInCase(int caseId)
        {
            return await _context.FileUploads
                .Where(f => f.CaseId == caseId)
                .ToListAsync();
        }

        // get details (not file)
        // GET: api/FileUploadsDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FileUploads>> GetFileUploadsDetails(int id)
        {
            var fileUploads = await _context.FileUploads.FindAsync(id);

            if (fileUploads == null)
            {
                return NotFound();
            }

            return fileUploads;
        }

        // POST: api/FileUploads
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        //public async Task<ActionResult<FileUploads>> PostFileUploads(FileUploads fileUploads) // was
        [HttpPost]
        public async Task<ActionResult> PostFileUploads([FromForm] FileUploadsCreate fileUploads) //[FromForm]
        {
            var file = fileUploads.File;
            var uploadResultImage = new ImageUploadResult();
            var uploadResultRaw = new RawUploadResult();
            string url;
            string publicId;

            if (file == null || file.Length == 0)
            {
                return BadRequest("No file provided");
            }

            if (file.Length > 400000)
            {
                return BadRequest("File too big. Please resize it.");
            }
            
            using (var stream = file.OpenReadStream())
            {
                if (file.ContentType.Contains("image"))
                {
                    var uploadParamsImage = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream), // Name = "File", seems to work with images
                        Transformation = new Transformation().Width(400), // this resizes the image maintaining the same aspect ratio
                    };
                    uploadResultImage = _cloudinary.Upload(uploadParamsImage);
                    if (uploadResultImage.Uri == null)
                    {
                        return BadRequest("Could not upload file. Wrong file type.");
                    }
                    url = uploadResultImage.Uri.ToString();
                    publicId = uploadResultImage.PublicId;
                }
                else
                {
                    var uploadParams = new RawUploadParams()
                    {
                        File = new FileDescription(file.FileName, stream), // Name = "File", FileName includes file name inc extension
                    };
                    uploadResultRaw = _cloudinary.Upload(uploadParams);
                    if (uploadResultRaw.Uri == null)
                    {
                        return BadRequest("Could not upload file. Wrong file type.");
                    }
                    url = uploadResultRaw.Uri.ToString();
                    publicId = uploadResultRaw.PublicId;
                }

            };                
            
            var newFile = new FileUploads
            {
                URL = url,
                CaseId = fileUploads.CaseId,
                TimeStamp = DateTime.Now,
                PublicId = publicId,
                Description = fileUploads.Description
            };

            try
            {
                _context.FileUploads.Add(newFile); 
                await _context.SaveChangesAsync();
            }
            catch
            {
                // error therefore should the uploaded file be deleted?
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            return CreatedAtAction("GetFileUpload", new { id = newFile.Id }, newFile); 
        }

        // Not used but could be implemented
        // DELETE: api/FileUploads/5
        [Authorize(Policy = "RequireAdminRoleClaim")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<FileUploads>> DeleteFileUploads(int id)
        {
            var fileUploads = await _context.FileUploads.FindAsync(id);
            if (fileUploads == null)
            {
                return NotFound();
            }

            _context.FileUploads.Remove(fileUploads);
            await _context.SaveChangesAsync();

            return fileUploads;
        }

        private bool FileUploadsExists(int id)
        {
            return _context.FileUploads.Any(e => e.Id == id);
        }
    }
}
