using Microsoft.EntityFrameworkCore.Migrations;

namespace TrackIT.Migrations
{
    public partial class AddSoftwareId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_Software_SoftwareId",
                table: "Cases");

            migrationBuilder.AlterColumn<int>(
                name: "SoftwareId",
                table: "Cases",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_Software_SoftwareId",
                table: "Cases",
                column: "SoftwareId",
                principalTable: "Software",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_Software_SoftwareId",
                table: "Cases");

            migrationBuilder.AlterColumn<int>(
                name: "SoftwareId",
                table: "Cases",
                type: "int",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_Software_SoftwareId",
                table: "Cases",
                column: "SoftwareId",
                principalTable: "Software",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
