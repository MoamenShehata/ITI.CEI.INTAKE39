namespace ITI.CEI.INTAKE39.PEBS.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddProjectEntityToDataBase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Projects",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Location = c.String(),
                        Cost = c.Double(nullable: false),
                        Template = c.Int(nullable: false),
                        FK_PebsClientId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.AspNetUsers", t => t.FK_PebsClientId)
                .Index(t => t.FK_PebsClientId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Projects", "FK_PebsClientId", "dbo.AspNetUsers");
            DropIndex("dbo.Projects", new[] { "FK_PebsClientId" });
            DropTable("dbo.Projects");
        }
    }
}
