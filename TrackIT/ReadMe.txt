Create solution
Run it and try to log in or register so that the EF error page appears - click migrate and refresh. This should create the user database.
Add classes as required in Model folder
Add controllers as required using EF API CRUD. Adjust as required.
Add migrations, update database
Add Angular components as required. Service for HTTP requests 


Adding fields to User (UserIdentity. ApplicationUser extends UserIdentity)
It is automatic in that you just add properties to the blank ApplicationUser class. It is already linked to use this class everywhere.

Add a migrations as required. E.G. "Add-migration Initial" then "update-database"
To revert - update-database CreateIdentitySchema (1st migration when Authorisation project created. Not worth going back further, i.e. update-database 0)
Then "Remove-Migration" to go back to previous migration. If you've done several just use "Remove-Migration" again.

All the views and code is hidden initially. To unhide it Add a scaffolding item and choose Identity then tick whatever you need to unhide.
You can then edit views and c# files as required.


Adding ngx-bootstrap datepicker:
  ng add ngx-bootstrap  --component datepicker

Needed to delete the line in angular.json where the styles are: node_modules/bootstrap/dist/css/bootstrap.min.css". ngx-bootstrap adds it in but it was already
put there by the ASP.NET Core Angular template.

