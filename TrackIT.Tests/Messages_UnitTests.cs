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

namespace TrackIT.Tests
{
    public class MessagesContollerTests : UnitTestSetUp
    {
        
        public MessagesContollerTests()
        {
            var messages = new List<Messages>()
            {
                new Messages { Id = 1, Comment = "Comment1 Case1", CaseId = 1, UserId = "abc", IsEmployee = true},
                new Messages { Id = 2, Comment = "Comment2 Case1", CaseId = 1, UserId = "e1", IsEmployee = false},
                new Messages { Id = 3, Comment = "Comment3 Case1", CaseId = 1, UserId = "abc", IsEmployee = true},
                new Messages { Id = 4, Comment = "Comment1 Case2", CaseId = 2, UserId = "abc", IsEmployee = true},
                new Messages { Id = 5, Comment = "Comment2 Case2", CaseId = 2, UserId = "e1", IsEmployee = false},
                new Messages { Id = 6, Comment = "Comment3 Case2", CaseId = 2, UserId = "abc", IsEmployee = true},
                new Messages { Id = 7, Comment = "Comment3 Case2", CaseId = 2, UserId = "e1", IsEmployee = false},
            };

            context.Messages.AddRange(messages);
            context.SaveChanges();

            SeedCases(context);
        }



        [Fact]
        public async void Check_All_Received()
        {
            var query = new MessagesController(context);

            var result = await query.GetMessagesInCase(0);  // async

            Assert.Equal(7, result.Value.ToList().Count);
            Assert.Equal(7, result.Value.Count());
        }

        [Fact]
        public async void GetAllMessages_In_Case_2()
        {
            var query = new MessagesController(context);

            var result = await query.GetMessagesInCase(2);  // async

            Assert.Equal(4, result.Value.ToList().Count);
            Assert.Equal(4, result.Value.Count());
        }

        [Fact]
        public async void GetAllMessages_Returns_OK()
        {
            var query = new MessagesController(context);

            var result = await query.GetMessagesInCase(0); // async

            Assert.IsType<ActionResult<IEnumerable<Messages>>>(result);
        }


        [Fact]
        public async void GetAllMessages_Check_First_And_Last_In_Case_1()
        {
            var query = new MessagesController(context);

            var result = await query.GetMessagesInCase(1);  // async

            Assert.Equal("Comment1 Case1", result.Value.First().Comment);
            Assert.Equal("Comment3 Case1", result.Value.Last().Comment);
        }

        [Fact]
        public async void DeleteMessages_Delete_Id_3()
        {
            var query = new MessagesController(context);
            
            var result = await query.DeleteMessages(3);  // async

            Assert.Equal("Comment3 Case1", result.Value.Comment);
        }

        [Fact]
        public async void DeleteMessages_Returns_OK()
        {
            var query = new MessagesController(context);

            var result = await query.DeleteMessages(3);  // async

            Assert.IsType<ActionResult<Messages>>(result);
        }


        [Fact]
        public async void PostMessages_Add()
        {
            var query = new MessagesController(context);

            var newMessage = new Messages { Id = 8, Comment = "Comment4 Case2", CaseId = 2, UserId = "abc", IsEmployee = true };

            var result = await query.PostMessages(newMessage);  // async
            var added = await query.GetMessagesInCase(0);  // async
            var singleReturnedMessage = added.Value.First(x => x.Id == 8);

            var resultGoodRequest = Assert.IsType<CreatedAtActionResult>(result.Result);
            var addedGoodRequest = Assert.IsType<Messages>(singleReturnedMessage);

            Assert.Equal(newMessage, singleReturnedMessage);
            Assert.Equal(newMessage, resultGoodRequest.Value);
            Assert.Equal(newMessage, addedGoodRequest);
        }

        [Fact]
        public async void PostMessage_Returns_OK()
        {
            var query = new MessagesController(context);

            var newMessage = new Messages { Id = 8, Comment = "Comment4 Case2", CaseId = 2, UserId = "abc", IsEmployee = true };

            var result = await query.PostMessages(newMessage);  // async
            var added = await query.GetMessagesInCase(0);  // async

            Assert.IsType<ActionResult<Messages>>(result);
            Assert.IsType<CreatedAtActionResult>(result.Result);
        }


        internal static void SeedCases(ApplicationDbContext context)
        {
            var cases = new List<Cases>()
            {
                new Cases { Id = 1, SoftwareId = 2, Title = "Title1", Description = "Desc1", Type = 1, UrgencyLevel = 2},
                new Cases { Id = 2, SoftwareId = 2, Title = "Title2", Description = "Desc2", Type = 1, UrgencyLevel = 2},
                new Cases { Id = 3, SoftwareId = 2, Title = "Title3", Description = "Desc3", Type = 1, UrgencyLevel = 2},
            };

            context.Cases.AddRange(cases);
            context.SaveChanges();
        }
    }
}
