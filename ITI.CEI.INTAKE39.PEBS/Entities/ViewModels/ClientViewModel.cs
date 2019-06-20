using ITI.CEI.INTAKE39.PEBS.Models;
using ITI.CEI.INTAKE39.PEBS.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Entities.ViewModels
{
    public class ClientViewModel
    {
        public ApplicationUser PebsClient { get; set; }
        public List<Project> Projects { get; set; }

    }
}