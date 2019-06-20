using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Json
{
    public class JsonObject
    {
        public double h1 { get; set; }
        public double h2 { get; set; }
        public double span { get; set; }
        public List<Bay> Mybays { get; set; }
    }
}