namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddProjectEntityToDataBaseforce : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.Projects", newName: "Project");
        }
        
        public override void Down()
        {
            RenameTable(name: "dbo.Project", newName: "Projects");
        }
    }
}
