using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Xbim.Ifc;
using Xbim.IO;
using Xbim.Common.Step21;
using Xbim.Ifc4.Kernel;
using Xbim.Ifc4.MeasureResource;
using Xbim.Ifc4.Interfaces;
using Xbim.Ifc4.ProductExtension;
using Xbim.Ifc4.GeometricConstraintResource;
using Xbim.Ifc4.GeometryResource;
using Xbim.Ifc4.SharedBldgElements;
using Xbim.Ifc4.PresentationAppearanceResource;
using Xbim.Ifc4.RepresentationResource;
using Xbim.Ifc4.GeometricModelResource;
using Xbim.Ifc4.ProfileResource;
using Xbim.Ifc4.PresentationOrganizationResource;
using Xbim.Ifc4.PropertyResource;
using Xbim.Ifc4.MaterialResource;

namespace ITI.CEI.INTAKE39.PEBS.Entities
{
    public class ColumnRectangle
    {
        public static IfcStore InitializeModelAndProject(string projectName)
        {

            var credentials = new XbimEditorCredentials()
            {
                ApplicationDevelopersName = "Moamen",
                ApplicationFullName = projectName,
                ApplicationIdentifier = projectName + ".exe",
                ApplicationVersion = "1.0",
                EditorsFamilyName = "Track",
                EditorsGivenName = "CEI",
                EditorsOrganisationName = "ITI"
            };

            var model = IfcStore.Create(credentials, XbimSchemaVersion.Ifc4, XbimStoreType.InMemoryModel);

            using (var trans = model.BeginTransaction("Initialize Project"))
            {
                var project = model.Instances.New<IfcProject>(pr =>
                {
                    pr.Name = projectName;
                    pr.LongName = "LongName_" + projectName;
                    pr.Phase = "Drafting";
                });


                project.UnitsInContext = model.Instances.New<IfcUnitAssignment>();

                var lengthUnit = model.Instances.New<IfcSIUnit>(siu =>
                {
                    siu.UnitType = IfcUnitEnum.LENGTHUNIT;
                    siu.Prefix = IfcSIPrefix.MILLI;
                    siu.Name = IfcSIUnitName.METRE;
                });

                project.UnitsInContext.Units.Add(lengthUnit);

                var massUnit = model.Instances.New<IfcSIUnit>(siu =>
                {
                    siu.UnitType = IfcUnitEnum.MASSUNIT;
                    siu.Prefix = IfcSIPrefix.GIGA;
                    siu.Name = IfcSIUnitName.GRAM;
                });

                project.UnitsInContext.Units.Add(massUnit);

                var massDensityUnit = model.Instances.New<IfcDerivedUnit>(du =>
                {
                    du.UnitType = IfcDerivedUnitEnum.MASSDENSITYUNIT;

                    du.Elements.Add(model.Instances.New<IfcDerivedUnitElement>(due =>
                    {
                        due.Exponent = 1;
                        due.Unit = massUnit;
                    }));

                    du.Elements.Add(model.Instances.New<IfcDerivedUnitElement>(due =>
                    {
                        due.Exponent = -3;
                        due.Unit = lengthUnit;
                    }));
                });

                project.UnitsInContext.Units.Add(massDensityUnit);

                trans.Commit();
            }
            return model;
        }

        public static IfcSite CreateSite(IfcStore model, string name)
        {
            using (var trans = model.BeginTransaction("Create Site"))
            {
                var site = model.Instances.New<IfcSite>(s =>
                {
                    s.Name = name;
                    s.CompositionType = IfcElementCompositionEnum.ELEMENT;
                    s.RefLatitude = new IfcCompoundPlaneAngleMeasure(new List<long>() { 42, 21, 31, 181945 });
                    s.RefLongitude = new IfcCompoundPlaneAngleMeasure(new List<long>() { -71, -3, -24, -263305 });
                    s.RefElevation = 0;
                    s.ObjectPlacement = model.Instances.New<IfcLocalPlacement>(lp =>
                    {
                        lp.RelativePlacement = model.Instances.New<IfcAxis2Placement3D>(ap3d =>
                        {
                            ap3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });
                        });
                    });
                });

                var project = model.Instances.OfType<IfcProject>().FirstOrDefault();
                if (project != null) project.AddSite(site);
                trans.Commit();
                return site;
            }
        }

        public static IfcBuilding CreateBuilding(IfcStore model, string name)
        {
            using (var trans = model.BeginTransaction("Create Building"))
            {
                var site = model.Instances.OfType<IfcSite>().FirstOrDefault();
                if (site != null)
                {
                    var building = model.Instances.New<IfcBuilding>(bl =>
                    {
                        bl.Name = name;
                        bl.CompositionType = IfcElementCompositionEnum.ELEMENT;
                        bl.ObjectPlacement = model.Instances.New<IfcLocalPlacement>(lp =>
                        {
                            lp.RelativePlacement = model.Instances.New<IfcAxis2Placement3D>(ap3d =>
                            {
                                ap3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });

                            });
                            lp.PlacementRelTo = site.ObjectPlacement;
                        });
                    });
                    site.AddBuilding(building);
                    trans.Commit();
                    return building;
                }
                return null;
            }
        }

        public static IfcBuildingStorey CreateStorey(IfcStore model, string name)
        {
            using (var trans = model.BeginTransaction("Create Story"))
            {
                var building = model.Instances.OfType<IfcBuilding>().FirstOrDefault();
                if (building != null)
                {
                    var storey = model.Instances.New<IfcBuildingStorey>(st =>
                    {
                        st.Name = name;
                        st.LongName = name;
                        st.CompositionType = IfcElementCompositionEnum.ELEMENT;
                        st.Elevation = 0;
                        st.ObjectPlacement = model.Instances.New<IfcLocalPlacement>(lp =>
                        {
                            lp.RelativePlacement = model.Instances.New<IfcAxis2Placement3D>(ap3d =>
                            {
                                ap3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });

                            });
                            lp.PlacementRelTo = building.ObjectPlacement;

                        });
                    });
                    building.AddToSpatialDecomposition(storey);
                    trans.Commit();
                    return storey;
                }
                return null;
            }
        }

        public static IfcColumn CreateIfcColumnRectangleStorey(IfcStore model, double length, double width, double height, double x, double y, double z)
        {
            using (var trans = model.BeginTransaction("Create Column"))
            {
                var columnName = $"Column_Rectangular_{length}x{width}";
                var columnObjectType = $"Column_Rectangular_{length}x{width}";

                var column = model.Instances.New<IfcColumn>(col =>
                {
                    col.Name = columnName;
                    col.ObjectType = columnObjectType;
                    col.PredefinedType = IfcColumnTypeEnum.COLUMN;
                    col.ObjectPlacement = model.Instances.New<IfcLocalPlacement>(lp =>
                    {
                        lp.RelativePlacement = model.Instances.New<IfcAxis2Placement3D>(ap3d =>
                        {
                            ap3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(x, y, z); });

                        });

                    });
                });

                var surfaceStyleName = "Concrete, Cast-in-Place gray";
                var surfaceStyle = model.Instances.OfType<IfcSurfaceStyle>()
                    .Where(ss => ss.Name == surfaceStyleName).FirstOrDefault();
                if (surfaceStyle == null)
                {
                    surfaceStyle = model.Instances.New<IfcSurfaceStyle>(ss =>
                    {
                        ss.Name = surfaceStyleName;
                        ss.Side = IfcSurfaceSide.BOTH;
                        ss.Styles.Add(model.Instances.New<IfcSurfaceStyleRendering>(ssr =>
                        {
                            ssr.Transparency = 0;
                            ssr.ReflectanceMethod = IfcReflectanceMethodEnum.NOTDEFINED;
                            ssr.SurfaceColour = model.Instances.New<IfcColourRgb>(rgd =>
                            {
                                rgd.Red = 0.752331;
                                rgd.Green = 0;
                                rgd.Blue = 0;
                            });
                            ssr.SpecularColour = new IfcNormalisedRatioMeasure(0.5);
                            ssr.SpecularHighlight = new IfcSpecularExponent(128);
                        }));
                    });
                }

                var styledItem = model.Instances.New<IfcStyledItem>(si =>
                {
                    si.Styles.Add(model.Instances.New<IfcPresentationStyleAssignment>(psa =>
                    {
                        psa.Styles.Add(surfaceStyle);
                    }));
                });

                var geometricRepresentationContext = model.Instances.OfType<IfcProject>().FirstOrDefault().RepresentationContexts.Cast<IfcGeometricRepresentationContext>().Where(grc => grc.ContextIdentifier == null && grc.ContextType == "Model" && grc.CoordinateSpaceDimension == 3 && grc.Precision == 0.01).FirstOrDefault();
                if (geometricRepresentationContext == null)
                {
                    geometricRepresentationContext = model.Instances.New<IfcGeometricRepresentationContext>(grc =>
                    {
                        grc.ContextIdentifier = null;
                        grc.ContextType = "Model";
                        grc.CoordinateSpaceDimension = 3;
                        grc.Precision = 0.01;
                        grc.WorldCoordinateSystem = model.Instances.New<IfcAxis2Placement3D>(a2p =>
                        {
                            a2p.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });
                        });
                        grc.TrueNorth = model.Instances.New<IfcDirection>(dir => { dir.SetXY(6.12303176911189E-17, 1); });
                        model.Instances.OfType<IfcProject>().FirstOrDefault().RepresentationContexts.Add(grc);
                    });
                }

                var geometricRepresentationSubContext = geometricRepresentationContext.HasSubContexts.Where(grsc => grsc.ContextIdentifier == "Body" && grsc.ContextType == "Model" && grsc.TargetView == IfcGeometricProjectionEnum.MODEL_VIEW).FirstOrDefault();
                if (geometricRepresentationSubContext == null)
                {
                    geometricRepresentationSubContext = model.Instances.New<IfcGeometricRepresentationSubContext>(grsc =>
                    {
                        grsc.ContextIdentifier = "Body";
                        grsc.ContextType = "Model";
                        grsc.TargetView = IfcGeometricProjectionEnum.MODEL_VIEW;
                        grsc.ParentContext = geometricRepresentationContext;
                    });
                }


                #region Completing Representation steps
                //PresentationLayerAssignment CAD presentation 
                //add the created shape representations to it
                var presentationLayerAssignment = model.Instances.OfType<IfcPresentationLayerAssignment>().Where(pla => pla.Name == "S-COLS").FirstOrDefault();
                if (presentationLayerAssignment == null)
                {
                    presentationLayerAssignment = model.Instances.New<IfcPresentationLayerAssignment>(pla => { pla.Name = "S-COLS"; });
                }

                var ProfileName = $"RectProfile{width}x{length}";
                //creating the representation map
                var representationMap = model.Instances.New<IfcRepresentationMap>(rm =>
                {
                    rm.MappingOrigin = model.Instances.New<IfcAxis2Placement3D>(a2p3d =>
                    {
                        a2p3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });
                    });
                    rm.MappedRepresentation = model.Instances.New<IfcShapeRepresentation>(msr =>
                    {
                        presentationLayerAssignment.AssignedItems.Add(msr);
                        msr.RepresentationIdentifier = "Body";
                        msr.RepresentationType = "SweptSolid";
                        msr.ContextOfItems = geometricRepresentationSubContext;
                        msr.Items.Add(model.Instances.New<IfcExtrudedAreaSolid>(eas =>
                        {
                            eas.Depth = height;
                            eas.SweptArea = model.Instances.New<IfcRectangleProfileDef>(rpd =>
                            {
                                rpd.ProfileType = IfcProfileTypeEnum.AREA;
                                rpd.ProfileName = ProfileName;
                                rpd.YDim = length;
                                rpd.XDim = width;
                                rpd.Position = model.Instances.New<IfcAxis2Placement2D>(a2p2 =>
                                {
                                    a2p2.Location = model.Instances.New<IfcCartesianPoint>(mcp =>
                                    {
                                        mcp.SetXY(0, 0);
                                    });
                                    a2p2.RefDirection = model.Instances.New<IfcDirection>(md =>
                                    {
                                        md.SetXY(1, 0);
                                    });
                                });
                            });
                            eas.Position = model.Instances.New<IfcAxis2Placement3D>(a2pl3d =>
                            {
                                a2pl3d.Location = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });
                                a2pl3d.Axis = model.Instances.New<IfcDirection>(a2ad =>
                                {
                                    a2ad.SetXYZ(0, 0, 1);
                                });
                                a2pl3d.RefDirection = model.Instances.New<IfcDirection>(a2rd =>
                                {
                                    a2rd.SetXYZ(0, -1, 0);
                                });
                            });
                            eas.ExtrudedDirection = eas.Position.Axis;
                            styledItem.Item = eas; //adding the visual style to the solid 
                        }));
                    });
                });



                //creating column representation and adding the representation map to it
                column.Representation = model.Instances.New<IfcProductDefinitionShape>(pds =>
                {
                    pds.Representations.Add(model.Instances.New<IfcShapeRepresentation>(sr =>
                    {
                        presentationLayerAssignment.AssignedItems.Add(sr);
                        sr.RepresentationIdentifier = "Body";
                        sr.RepresentationType = "MappedRepresentation";
                        sr.ContextOfItems = geometricRepresentationSubContext;
                        sr.Items.Add(model.Instances.New<IfcMappedItem>(mi =>
                        {
                            mi.MappingSource = representationMap;
                            mi.MappingTarget = model.Instances.New<IfcCartesianTransformationOperator3D>(cto3 =>
                            {
                                cto3.Scale = 1;
                                cto3.LocalOrigin = model.Instances.New<IfcCartesianPoint>(cp => { cp.SetXYZ(0, 0, 0); });
                            });
                        }));
                    }));
                });


                //creating a relation between the column and its column type using the representation map
                var columnTypeRelation = model.Instances.New<IfcRelDefinesByType>(rdbt =>
                {
                    rdbt.RelatingType = model.Instances.New<IfcColumnType>(ct =>
                    {
                        ct.Name = $"RectColumn{width}x{length}";
                        ct.ElementType = $"RectColumn{width}x{length}";
                        ct.PredefinedType = IfcColumnTypeEnum.COLUMN;
                        ct.RepresentationMaps.Add(representationMap);
                    });
                });
                columnTypeRelation.RelatedObjects.Add(column);
                #endregion

                var relDefineByProps = model.Instances.New<IfcRelDefinesByProperties>(rdbp =>
                {
                    rdbp.RelatedObjects.Add(column);
                    rdbp.RelatingPropertyDefinition = model.Instances.New<IfcPropertySet>(ps =>
                    {
                        ps.Name = "Column Property Set";
                        ps.HasProperties.Add(model.Instances.New<IfcPropertySingleValue>(psv =>
                        {
                            psv.Name = "LoadBearing";
                            psv.NominalValue = new IfcBoolean(true);
                        }));
                        ps.HasProperties.Add(model.Instances.New<IfcPropertySingleValue>(psv =>
                        {
                            psv.Name = "Reference";
                            psv.NominalValue = new IfcIdentifier(ProfileName);
                        }));
                    });
                });

                //adding material 

                #region Query for units from Project

                //----------------------------------------------------------
                //ifc SI Units
                //----------------------------------------------------------

                var lengthUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.LENGTHUNIT
                ).FirstOrDefault();

                var areaUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.AREAUNIT
                ).FirstOrDefault();

                var volumeUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.VOLUMEUNIT
                ).FirstOrDefault();

                var sectionModulusUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.SECTIONMODULUSUNIT
                ).FirstOrDefault();

                var momentOfInertiaUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.MOMENTOFINERTIAUNIT
                ).FirstOrDefault();

                var planeAngleUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.PLANEANGLEUNIT
                ).FirstOrDefault();

                var timeUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.TIMEUNIT
                ).FirstOrDefault();

                var massUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.MASSUNIT
                ).FirstOrDefault();

                var massDensityUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.MASSDENSITYUNIT
                ).FirstOrDefault();

                var forceUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.FORCEUNIT
                ).FirstOrDefault();

                var torqueUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.TORQUEUNIT
                ).FirstOrDefault();

                var pressureUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.PRESSUREUNIT
                ).FirstOrDefault();

                var linearForceUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.LINEARFORCEUNIT
                ).FirstOrDefault();

                var planarForceUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.PLANARFORCEUNIT
                ).FirstOrDefault();

                var linearMomentUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.PLANARFORCEUNIT
                ).FirstOrDefault();

                var shearModulusUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.SHEARMODULUSUNIT
                ).FirstOrDefault();

                var modulusOfElasticityUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.MODULUSOFELASTICITYUNIT
                ).FirstOrDefault();

                var thermodynamicTemperatureUnit = model.Instances.OfType<IfcSIUnit>().Where(siu =>
                    siu.UnitType == IfcUnitEnum.THERMODYNAMICTEMPERATUREUNIT
                ).FirstOrDefault();

                var thermalExpansionCoefficientUnit = model.Instances.OfType<IfcDerivedUnit>().Where(du =>
                    du.UnitType == IfcDerivedUnitEnum.MODULUSOFELASTICITYUNIT
               ).FirstOrDefault();

                //-------------------------------------------------------------------
                #endregion

                #region CreatingMaterial using selected units
                var materialName = "CompleteMaterial";
                var materialProfileSetUsage = model.Instances.New<IfcMaterialProfileSetUsage>(mpsu =>
                {
                    mpsu.ForProfileSet = model.Instances.New<IfcMaterialProfileSet>(mps =>
                    {
                        mps.MaterialProfiles.Add(model.Instances.New<IfcMaterialProfile>(mp =>
                        {
                            mp.Material = model.Instances.New<IfcMaterial>(mat =>
                            {
                                mat.Name = materialName;
                            });
                        }));
                    });
                });
                //creating material representation for cad styling
                var materialRepresentation = model.Instances.New<IfcMaterialDefinitionRepresentation>(mdr =>
                {
                    mdr.Representations.Add(model.Instances.New<IfcStyledRepresentation>(sr =>
                    {
                        sr.RepresentationIdentifier = "Style";
                        sr.RepresentationType = "Material";
                        sr.ContextOfItems = geometricRepresentationContext;
                        sr.Items.Add(model.Instances.New<IfcStyledItem>(si =>
                        {
                            si.Styles.Add(model.Instances.New<IfcPresentationStyleAssignment>(psa =>
                            {
                                psa.Styles.Add(surfaceStyle); // adding the surface style to the material 
                            }));
                        }));
                    }));
                    mdr.RepresentedMaterial = materialProfileSetUsage.ForProfileSet.MaterialProfiles.First().Material;
                });
                //IfcMaterialProperties and adding the created ifc material to it
                var materialProperties = model.Instances.New<IfcMaterialProperties>(mp =>
                {
                    mp.Name = materialName; ;
                    mp.Material = materialProfileSetUsage.ForProfileSet.MaterialProfiles.First().Material;
                    mp.Properties.Add(model.Instances.New<IfcPropertySingleValue>(prop =>
                    {
                        prop.Name = "CompressiveStrength";
                        prop.NominalValue = new IfcPressureMeasure(0.037579032);
                        prop.Unit = pressureUnit;
                    }));
                    mp.Properties.Add(model.Instances.New<IfcPropertySingleValue>(prop =>
                    {
                        prop.Name = "MassDensity";
                        prop.NominalValue = new IfcMassDensityMeasure(3.4027e-12);
                        prop.Unit = massDensityUnit;
                    }));
                    mp.Properties.Add(model.Instances.New<IfcPropertySingleValue>(prop =>
                    {
                        prop.Name = "PoissonRatio";
                        prop.NominalValue = new IfcRatioMeasure(0.3);
                    }));
                    mp.Properties.Add(model.Instances.New<IfcPropertySingleValue>(prop =>
                    {
                        prop.Name = "ThermalExpansionCoefficient";
                        prop.NominalValue = new IfcThermalExpansionCoefficientMeasure(10.8999999e-6);
                        prop.Unit = thermalExpansionCoefficientUnit;
                    }));
                    mp.Properties.Add(model.Instances.New<IfcPropertySingleValue>(prop =>
                    {
                        prop.Name = "YoungModulus";
                        prop.NominalValue = new IfcModulusOfElasticityMeasure(24.855578);
                        prop.Unit = modulusOfElasticityUnit;
                    }));

                });
                #endregion

                #region Assigning The material to the Column


                var relAssociatesMaterial = model.Instances.New<IfcRelAssociatesMaterial>();
                relAssociatesMaterial.RelatingMaterial = materialProfileSetUsage.ForProfileSet.MaterialProfiles.First().Material;
                relAssociatesMaterial.RelatedObjects.Add(columnTypeRelation.RelatingType);
                relAssociatesMaterial.RelatedObjects.Add(column);

                #endregion



                //add to the storey
                var storey = model.Instances.OfType<IfcBuildingStorey>().FirstOrDefault();
                if (storey != null) storey.AddElement(column);

                trans.Commit();
                return column;
            }
        }
    }
}