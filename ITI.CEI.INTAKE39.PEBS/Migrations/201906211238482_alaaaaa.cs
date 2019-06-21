namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class alaaaaa : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Report",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Cost = c.Int(nullable: false),
                        DueDate = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.Project", "Report_Id", c => c.Int());
            CreateIndex("dbo.Project", "Report_Id");
            AddForeignKey("dbo.Project", "Report_Id", "dbo.Report", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Project", "Report_Id", "dbo.Report");
            DropIndex("dbo.Project", new[] { "Report_Id" });
            DropColumn("dbo.Project", "Report_Id");
            DropTable("dbo.Report");
        }
    }
}
