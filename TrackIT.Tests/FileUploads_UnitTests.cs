using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using TrackIT.Data;
using Xunit;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using TrackIT.Models;
using TrackIT.Controllers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace TrackIT.Tests
{
    public class FileUploadsContollerTests : UnitTestSetUp
    {

        public FileUploadsContollerTests()
        {
            var cases = new List<Cases>()
            {
                new Cases { Id = 1, SoftwareId = 2, Title = "Title1", Description = "Desc1", Type = 1, UrgencyLevel = 2, UserId = "a1", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 2, SoftwareId = 2, Title = "Title2", Description = "Desc2", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 3, SoftwareId = 2, Title = "Title3", Description = "Desc3", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 4, SoftwareId = 3, Title = "Title4", Description = "Desc4", Type = 2, UrgencyLevel = 3, UserId = "a1", ContactId = null, Status = 7, StaffAssigned = "a2" },
                new Cases { Id = 5, SoftwareId = 3, Title = "Title5", Description = "Desc5", Type = 2, UrgencyLevel = 3, UserId = "a3", ContactId = null, Status = 7 },

                new Cases { Id = 6, SoftwareId = 2, Title = "Title6", Description = "Desc6", Type = 1, UrgencyLevel = 2, UserId = "a3", ContactId = null, Status = 1 },
                new Cases { Id = 7, SoftwareId = 3, Title = "Title7", Description = "Desc7", Type = 1, UrgencyLevel = 3, UserId = "a3", ContactId = null, Status = 1 },
                new Cases { Id = 8, SoftwareId = 2, Title = "Title8", Description = "Desc8", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 9, SoftwareId = 3, Title = "Title9", Description = "Desc9", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 10, SoftwareId = 2, Title = "Title10", Description = "Desc10", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 11, SoftwareId = 2, Title = "Title11", Description = "Desc11", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 12, SoftwareId = 2, Title = "Title12", Description = "Desc12", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 13, SoftwareId = 3, Title = "Title13", Description = "Desc13", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 14, SoftwareId = 3, Title = "Title14", Description = "Desc14", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 15, SoftwareId = 3, Title = "Title15", Description = "Desc15", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 7 },
                new Cases { Id = 16, SoftwareId = 2, Title = "Title16", Description = "Desc16", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 17, SoftwareId = 2, Title = "Title17", Description = "Desc17", Type = 1, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 18, SoftwareId = 2, Title = "Title18", Description = "Desc18", Type = 1, UrgencyLevel = 2, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 19, SoftwareId = 3, Title = "Title19", Description = "Desc19", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 20, SoftwareId = 3, Title = "Title20", Description = "Desc20", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
                new Cases { Id = 21, SoftwareId = 3, Title = "Title21", Description = "Desc21", Type = 2, UrgencyLevel = 3, UserId = "a2", ContactId = null, Status = 1 },
            };

            context.Cases.AddRange(cases);
            context.SaveChanges();


            var fileUploads = new List<FileUploads>()
            {
                new FileUploads { Id = 1, CaseId = 1, URL = "a12345", Description = "Desc1", PublicId = "hhh12345"},
                new FileUploads { Id = 2, CaseId = 1, URL = "b12345", Description = "Desc2", PublicId = "iii12345"},
                new FileUploads { Id = 3, CaseId = 2, URL = "c12345", Description = "Desc3", PublicId = "jjj12345"},
                new FileUploads { Id = 4, CaseId = 1, URL = "d12345", Description = "Desc4", PublicId = "kkk12345"},
                new FileUploads { Id = 5, CaseId = 3, URL = "e12345", Description = "Desc5", PublicId = "lll12345"},
                new FileUploads { Id = 6, CaseId = 1, URL = "f12345", Description = "Desc6", PublicId = "mmm12345"},
            };

            context.FileUploads.AddRange(fileUploads);
            context.SaveChanges();
        }



        [Fact]
        public async void GetFileUploads_In_Case()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.GetFileUploadsInCase(1);  // async

            Assert.Equal(4, result.Value.ToList().Count);
            Assert.Equal(4, result.Value.Count());
        }

        [Fact]
        public async void GetFileUploads_In_Case_Returns_OK()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.GetFileUploadsInCase(1);  // async

            Assert.IsType<ActionResult<IEnumerable<FileUploads>>>(result);
        }

        [Fact]
        public async void GetFileUploads_In_Case_Check_First_And_Last()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.GetFileUploadsInCase(1);  // async

            result = result.Value.OrderByDescending(x => x.Id).ToList();

            Assert.Equal(6, result.Value.First().Id);
            Assert.Equal(1, result.Value.Last().Id);
        }

        [Fact]
        public async void GetFileUploadsDetails_Get_Id_2()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.GetFileUploadsDetails(2);  // async

            Assert.Equal(2, result.Value.Id);
            Assert.Equal(1, result.Value.CaseId);
            Assert.Equal("b12345", result.Value.URL);
            Assert.Equal("Desc2", result.Value.Description);
            Assert.Equal("iii12345", result.Value.PublicId);
        }

        [Fact]
        public async void GetFileUploadsDetails_Returns_OK()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.GetFileUploadsDetails(2);  // async

            Assert.IsType<ActionResult<FileUploads>>(result);
        }

        [Fact]
        public async void DeleteFileUploads_Delete_Id_2()
        {
            var query = new FileUploadsController(context, null);
            
            var result = await query.DeleteFileUploads(2);  // async

            Assert.Equal(2, result.Value.Id);
            Assert.Equal(1, result.Value.CaseId);
            Assert.Equal("b12345", result.Value.URL);
            Assert.Equal("Desc2", result.Value.Description);
            Assert.Equal("iii12345", result.Value.PublicId);
        }

        [Fact]
        public async void DeleteFileUploads_Returns_OK()
        {
            var query = new FileUploadsController(context, null);

            var result = await query.DeleteFileUploads(2);  // async

            Assert.IsType<ActionResult<FileUploads>>(result);
        }


        [Fact(Skip = "Can't test without FormFile and mocking Cloudinary")]
        public async void PostFileUploads_Add_And_Save_Upload_To_Cloud()
        {
            var query = new FileUploadsController(context, null);

            var newUpload = new FileUploadsCreate { CaseId = 3, URL = "g12345", Description = "Desc7", PublicId = "nnn12345", 
                File = {  }
            }; // Id = 7

            var result = await query.PostFileUploads(newUpload);  // async
            var added = await query.GetFileUploadsDetails(7);  // async

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result);
            var addedGoodRequest = Assert.IsType<FileUploadsCreate>(added.Value);

            Assert.Equal(newUpload.CaseId, added.Value.CaseId);
            Assert.Equal(newUpload.URL, added.Value.URL);
            Assert.Equal(newUpload.Description, added.Value.Description);
            Assert.Equal(newUpload.PublicId, added.Value.PublicId);
            Assert.Equal(7, added.Value.Id);
            Assert.Equal(newUpload, resultGoodRequest.Value);
            Assert.Equal(newUpload, addedGoodRequest);
        }

        [Fact(Skip = "Can't test without FormFile and mocking Cloudinary")]
        public async void PostFileUploads_Returns_OK()
        {
            var query = new FileUploadsController(context, null);

            var newUpload = new FileUploadsCreate { CaseId = 3, URL = "g12345", Description = "Desc7", PublicId = "nnn12345" }; // Id = 7

            var result = await query.PostFileUploads(newUpload);  // async

            Assert.IsType<ActionResult<FileUploadsCreate>>(result);
            Assert.IsType<CreatedAtActionResult>(result);
        }


    }
}
