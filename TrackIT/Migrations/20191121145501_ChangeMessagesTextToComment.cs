using Microsoft.EntityFrameworkCore.Migrations;

namespace TrackIT.Migrations
{
    public partial class ChangeMessagesTextToComment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Message",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Messages",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Messages");

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "Messages",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
