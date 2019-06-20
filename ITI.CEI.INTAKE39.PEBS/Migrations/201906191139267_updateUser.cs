namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class updateUser : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Project", "Report_Path", c => c.String());
            AddColumn("dbo.Project", "Project_Path", c => c.String());
            AddColumn("dbo.AspNetUsers", "RoleType", c => c.String());
            DropColumn("dbo.Project", "Template");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Project", "Template", c => c.Int(nullable: false));
            DropColumn("dbo.AspNetUsers", "RoleType");
            DropColumn("dbo.Project", "Project_Path");
            DropColumn("dbo.Project", "Report_Path");
        }
    }
}
