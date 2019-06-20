using ITI.CEI.INTAKE39.PEBS.Entities;
using ITI.CEI.INTAKE39.PEBS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ITI.CEI.INTAKE39.PEBS.Controllers
{
    public class HomeController : Controller
    {   
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        [HttpPost]
        public ActionResult AddColumn(ColumnViewModel columnViewModel)
        {
           //var model= ColumnRectangle.InitializeModelAndProject("PEBS1");
            
           // var site = ColumnRectangle.CreateSite(model, "site-1");
           // var building = ColumnRectangle.CreateBuilding(model, "building-2");
           // var storey = ColumnRectangle.CreateStorey(model, "floor-1");
           // //var column1 = ColumnRectangle.CreateIfcColumnRectangleStorey(model,200,200,2000,0,0,0);
           // var column1 = ColumnRectangle.CreateIfcColumnRectangleStorey(model, columnViewModel.length, columnViewModel.width, columnViewModel.height, columnViewModel.x, columnViewModel.y, columnViewModel.z);
           // model.SaveAs("C:\\Users\\Lenovo\\Desktop\\pebsi.ifc",Xbim.IO.StorageType.Ifc);

            return View();
        }

        
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}