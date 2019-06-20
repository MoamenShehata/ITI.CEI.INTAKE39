using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Models.Entities
{
    [Table("Project")]
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public double Cost { get; set; }
        public string Report_Path { get; set; }
        public string Project_Path { get; set; }

        public ApplicationUser PebsClient { get; set; }

        [ForeignKey("PebsClient")]
        public string FK_PebsClientId { get; set; }



        

        
       
    }
}