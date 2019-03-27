using ITI.CEI.INTAKE39.PEBS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Entities
{
    [Table("Project")]
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public double Cost { get; set; }
        public ProjectType Template { get; set; }

        public ApplicationUser PebsClient { get; set; }

        [ForeignKey("PebsClient")]
        public string FK_PebsClientId { get; set; }

        public Project(string name, ProjectType projectType)
        {
            Name = name;Template = projectType;
        }

        public Project()
        {

        }
    }
}