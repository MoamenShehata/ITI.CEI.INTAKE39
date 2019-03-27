using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ITI.CEI.INTAKE39.PEBS.Entities
{
    public class IBeamColumn
    {
        public double Height { get; set; }
        public double FlangeWidth { get; set; }
        public double FlangeThickness { get; set; }
        public double WebHeight { get; set; }
        public double WebThickness { get; set; }
        public MyPoint BasePoint { get; set; }

    }
}