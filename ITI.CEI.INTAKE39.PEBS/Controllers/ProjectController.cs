using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITI.CEI.INTAKE39.PEBS.Controllers
{
    public class ProjectController : Controller
    {
        // GET: Project
        public ActionResult ProjectHomePage()
        {
            return View();
        }

        public ActionResult NewIFC()
        {
            return View();
        }
    }
}