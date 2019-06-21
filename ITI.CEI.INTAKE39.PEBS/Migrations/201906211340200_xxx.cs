namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class xxx : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Report", "DueDate", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Report", "DueDate", c => c.DateTime(nullable: false));
        }
    }
}
