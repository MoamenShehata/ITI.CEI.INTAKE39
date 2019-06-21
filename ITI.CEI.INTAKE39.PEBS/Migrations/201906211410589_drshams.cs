namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class drshams : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Report", "Projectid", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Report", "Projectid");
        }
    }
}
