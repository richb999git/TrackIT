using Microsoft.EntityFrameworkCore.Migrations;

namespace TrackIT.Migrations
{
    public partial class AddContactId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContactId",
                table: "Cases",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Cases_ContactId",
                table: "Cases",
                column: "ContactId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_AspNetUsers_ContactId",
                table: "Cases",
                column: "ContactId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_AspNetUsers_ContactId",
                table: "Cases");

            migrationBuilder.DropIndex(
                name: "IX_Cases_ContactId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "ContactId",
                table: "Cases");
        }
    }
}
