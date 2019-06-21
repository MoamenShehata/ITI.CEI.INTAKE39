namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class addnotestoreport : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Report", "Notes", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Report", "Notes");
        }
    }
}
