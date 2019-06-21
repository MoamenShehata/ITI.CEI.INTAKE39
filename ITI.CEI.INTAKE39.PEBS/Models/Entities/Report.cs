using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Models.Entities
{
    [Table("Report")]
    public class Report
    {
        public int Id { get; set; }
        public int Cost { get; set; }
        public string  DueDate { get; set; }
        public string Notes { get; set; }
        public int Projectid { get; set; }
        //public Project PebsProject { get; set; }

        // [ForeignKey("PebsProject")]
        // public int FK_ProjectId { get; set; }

    }
}