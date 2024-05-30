import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container } from '@mui/system';
import { Grid , Paper } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';



export const Mainpage = () => {


    const [comp, setComp] = useState()
    const [material_type, setMaterial_type] = useState()
    const [producer_loc, setProducer_loc] = useState()
    const [producer_name, setProducer_name] = useState()
    const [property, setProperty] = useState()
    const [app_area, setApp_area] = useState()
    const [material_name, setMaterial_name] = useState()
    const [responseData, setResponseData] = useState([])
    const [comparisonInput, setComparisonInput] = useState()
    

    const [material_Types, setMaterial_Types] = useState([])
    
    useEffect(() => {
        axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', {params: {query: `
        PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT  ?x WHERE {
            ?x rdfs:subClassOf* material:Eng_Material    
        }`}}).then(response => {
            
            for(var i = 0; i < response.data.results.bindings.length; i++){
                setMaterial_Types([...material_Types, response.data.results.bindings[i].x.value.split('#')[1]])
            }
            
        })
    } , [])
    
    
    const handleChangeComp = (event) => {
        setComp(event.target.value);
        console.log("Comp: ", event.target.value)
    }
    const handleChangeMat_type = (event) => {
        setMaterial_type(event.target.textContent);
        console.log("mat_t : ", event.target.textContent)
    }
    const handleChangeprod_loc = (event) => {
        setProducer_loc(event.target.textContent);
        console.log("Prodcuer Loc: ", event.target.textContent)
    }
    const handleChangeprod_name = (event) => {
        setProducer_name(event.target.textContent);
        console.log("Producer_name: ",event.target.textContent)
    }
    const handleChangeprop = (event) => {
        setProperty(event.target.textContent)
        console.log("property: ", event.target.textContent)
    }
    const handleChangeapp_area = (event) => {
        setApp_area(event.target.textContent)
        console.log("App_Area: ", event.target.textContent)
    }

    const handleSubmit = () => {
        var filter_statement = ''
        
        if((comp != null) || (comparisonInput != null) || (producer_name != null) || (app_area != null) || (material_type != null)){
            filter_statement += 'FILTER('
            if((comp != null) && (comparisonInput != null)){
                filter_statement += `(xsd:float(?min_value) ${comp} ${comparisonInput}) `
                if((producer_name != null) || (app_area != null)){
                    filter_statement += '&& '
                }
            }
            if((producer_name != null)){
                filter_statement += `(?producer = '${producer_name}') `
                if((app_area != null)){
                    filter_statement += '&& '
                }
            }
            if((app_area != null)){
                filter_statement += `(?Application_Area = '${app_area}')`
            }
            if((material_type != null)){
                filter_statement += `(STRENDS(str(?y),'${material_type}'))`
            }
            filter_statement += ')'
        }
        


        axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?name (CONCAT(?min_value, ?unitname) as ?value_unit) (GROUP_CONCAT(DISTINCT ?app_name; SEPARATOR=", ") AS ?Application_Areas) ?producer (GROUP_CONCAT(DISTINCT ?location; SEPARATOR=", ") AS ?Locations)  WHERE {
                ?x a ?y.
                ?y rdfs:subClassOf* material:Eng_Material.
                ?x material:has_name ?name .
                ?x material:produced_by ?prod .
                ?prod material:has_name ?producer .
                ?prod material:has_Location ?loc .
                ?loc material:has_name ?location .
                ?x material:has_Application_Area ?app .
                ?app material:has_name ?app_name.
                ?x material:has_Material_Property ?prop .
                ?prop rdf:type ?type .
                ?prop material:has_name ?propname .
                ?prop a material:${property} .
                ?prop material:has_Measurement ?mes .
                ?mes material:has_min_value ?min_value . 
                ?mes material:has_unit ?unit .
                ?unit material:has_name ?unitname .
                ${filter_statement}
                
                
              
            } 
            Group by ?name   ?min_value  ?unitname ?producer
            Order by ?name`}}).then(response => {
                console.log(response.data.results.bindings)
                setResponseData(response.data.results.bindings)
            })

            console.log(`
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?name (CONCAT(?min_value, ?unitname) as ?value_unit) (GROUP_CONCAT(DISTINCT ?app_name; SEPARATOR=", ") AS ?Application_Areas) ?producer (GROUP_CONCAT(DISTINCT ?location; SEPARATOR=", ") AS ?Locations)  WHERE {
                ?x a ?y.
                ?y rdfs:subClassOf* material:Eng_Material.
                ?x material:has_name ?name .
                ?x material:produced_by ?prod .
                ?prod material:has_name ?producer .
                ?prod material:has_Location ?loc .
                ?loc material:has_name ?location .
                ?x material:has_Application_Area ?app .
                ?app material:has_name ?app_name.
                ?x material:has_Material_Property ?prop .
                ?prop rdf:type ?type .
                ?prop material:has_name ?propname .
                ?prop a material:${property} .
                ?prop material:has_Measurement ?mes .
                ?mes material:has_min_value ?min_value . 
                ?mes material:has_unit ?unit .
                ?unit material:has_name ?unitname .
                ${filter_statement}
                
               
              
            } 
            Group by ?name   ?min_value  ?unitname ?producer
            Order by ?name`)

            /* axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?name (CONCAT(?value, ?unitname) as ?value_unit) (GROUP_CONCAT(?Application_Area; SEPARATOR=", ") AS ?Application_Areas) ?producer (GROUP_CONCAT( DISTINCT ?Location; SEPARATOR=", ") AS ?Locations) WHERE {
            
            ?x a material:${material_type} .
            ?x material:has_name ?name .
            ?x material:has_Material_Property ?c .
            ?c rdf:type material:${property} .
            ?c material:has_Measurement ?measure .
            ?c material:has_name ?prop_name .
            ?measure material:has_min_value ?value .
            ?measure material:has_unit ?unit .
            ?unit material:has_name ?unitname .
            ?x material:produced_by ?prod .
            ?prod material:has_name ?producer .
            ?prod material:has_Location ?Loc .
            ?Loc material:has_name ?Location .
            ?x material:has_Application_Area ?Application_Ar .
            ?Application_Ar material:has_name ?Application_Area .
            ${filter_statement}.
            }
            GROUP BY  ?name ?value ?unitname ?producer ?Location 
            ORDER BY ?name`}}).then(response => {
                console.log(response.data.results.bindings)
                setResponseData(response.data.results.bindings)
            }) */
    
    
        console.log('material type', material_type, "Comp: ", comp, 'producer_loc: ', producer_loc , 'producer_name', producer_name, 'property', property, 'app_area', app_area, 'material_name', material_name, 'ComparisonInput', comparisonInput)
        
        
        
        
        
        
        /* console.log(`PREFIX ma: <http://www.w3.org/ns/ma-ont#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            PREFIX ma: <http://www.w3.org/ns/ma-ont#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?name (CONCAT(?value, ?unitname) as ?value_unit) (GROUP_CONCAT(?Application_Area; SEPARATOR=", ") AS ?Application_Areas) ?producer (GROUP_CONCAT( DISTINCT ?Location; SEPARATOR=", ") AS ?Locations) WHERE {
            
            ?x a material:${material_type} .
            ?x material:has_name ?name .
            ?x material:has_Material_Property ?c .
            ?c rdf:type material:${property} .
            ?c material:has_Measurement ?measure .
            ?c material:has_name ?prop_name .
            ?measure material:has_min_value ?value .
            ?measure material:has_unit ?unit .
            ?unit material:has_name ?unitname .
            ?x material:produced_by ?prod .
            ?prod material:has_name ?producer .
            ?prod material:has_Location ?Loc .
            ?Loc material:has_name ?Location .
            ?x material:has_Application_Area ?Application_Ar .
            ?Application_Ar material:has_name ?Application_Area .
            ${filter_statement}.
            }
            GROUP BY  ?name ?value ?unitname ?producer ?Location 
            ORDER BY ?name`) */
    }

    const handleMaterial_name = (event) => {
        setMaterial_name(event.target.value)
        console.log('Material Name: ', event.target.value)
    }

    const handleComparisonInput = (event) => {
        setComparisonInput(event.target.value)
        console.log('Comparison Input: ', event.target.value)
    }

    
    


    
    
    

    const producers = [
        {label: "ALUDIUM"},
        {label: "AMBI"},
        {label: "ARCELORMITTAL"},
        {label: "ASTM"},
        {label: "Deutsche Edelstahlwerke Specialty Steel (DEW)"},
        {label: "ALLEIMA (FORMERLY SANDVIK MATERIALS TECHNOLOGY)"},
        {label: "DILLINGER"},
        {label: "Sverdrup Steel"},
        {label: "HEMPEL SPECIAL METALS"},
        {label: "Hempel Special Metals"},
        {label: "Remy Stahl"},
        {label: "Salomons Metalen"},
        {label: "Sandvik Materials Technology"},
        {label: "Ugitech SA"},
        {label: "VDM METALS"}
    ]

    const locations = [
        {label: "France"},
        {label: "Spain"},
        {label: "New Delhi"},
        {label: "Europe"},
        {label: "North America"},
        {label: "South America"},
        {label: "America"},
        {label: "Brussels"},
        {label: "Canada"},
        {label: "China"},
        {label: "Sweden"},
        {label: "Australia"},
        {label: "Germany"},
        {label: "India"},
        {label: "Ireland"},
        {label: "Italy"},
        {label: "Poland"},
        {label: "Turkey"},
        {label: "United Kingdom"},
        {label: "Holland"},
        {label: "Korea"},
        {label: "South Korea"}
    ]

    const properties = [
        {label: "Conductivity"},
        {label: "Resistivity"},
        {label: "Bio-Based_Content"},
        {label: "Bulk_Density"},
        {label: "Chemical_Composition"},
        {label: "Coefficient_of_Friction"},
        {label: "Density"},
        {label: "Handling_Recommendation"},
        {label: "Machinability"},
        {label: "Material_Cost"},
        {label: "Particle_Size"},
        {label: "Particle_Size_Range"},
        {label: "Recycled_Content"},
        {label: "Reduction_of_Area"},
        {label: "Residual_Monomer"},
        {label: "Water_Content"},
        {label: "Relative_Magnetic_Permeability"},
        {label: "Remenence"},
        {label: "Saturation_Polarization"},
        {label: "Carbon_Equivalent_CET"},
        {label: "Carbon_Equivalent_CEV"},
        {label: "Charpy_Impact_Energy_V-notch"},
        {label: "Coercive_Force"},
        {label: "Compression_Strength"},
        {label: "Compressive_Yield_Strength"},
        {label: "Creep_Strength"},
        {label: "Creep_Strength_10to4"},
        {label: "Creep_Strength_10to5"},
        {label: "Elastic_Modulus"},
        {label: "Elongation"},
        {label: "Fatigue_Strength"},
        {label: "Flexural_Modulus"},
        {label: "Flexural_Strength"},
        {label: "Hardness_Brinell"},
        {label: "Hardness_HBW"},
        {label: "Hardness_Rockwell"},
        {label: "Hardness_Vickers"},
        {label: "Impact_Strength_Charpy_notched"},
        {label: "Impact_Trans_V_notch"},
        {label: "Plane-Strain_Fracture_Toughness"},
        {label: "Poissons_Ratio"},
        {label: "Reduction_of_Areas"},
        {label: "Shear_Modulus"},
        {label: "Shear_Strength"},
        {label: "Tensile_Strength"},
        {label: "Torsion_Strength"},
        {label: "Yield_Strength"},
        {label: "Melt_Mass-Flow_Rate"},
        {label: "Curie_Temp"},
        {label: "Glass_Transition_Temp"},
        {label: "Heat_Capacity"},
        {label: "Heat_Conduction"},
        {label: "Heat_Deflection_Temp"},
        {label: "Max_Service_Temp"},
        {label: "Melting_Point"},
        {label: "Thermal_Conductivity"},
        {label: "Thermal_Diffusivity"},
        {label: "Thermal_Expansion"}
    ]

    const material_type_all = [
        {label: "Eng_Material"},
        {label: "Ceramic"},
        {label: "Carbon"},
        {label: "Carbon_Nanotube"},
        {label: "Diamond"},
        {label: "Natural_Diamond"},
        {label: "Synthetic_Diamond"},
        {label: "Graphene"},
        {label: "Graphite"},
        {label: "Engineering_Ceramic"},
        {label: "NonOxide_Based_Ceramic"},
        {label: "Oxide_Based_Ceramic"},
        {label: "Natural_Ceramic"},
        {label: "Composit"},
        {label: "Ceramic_Matrix_Composite"},
        {label: "Carbide_Based"},
        {label: "Oxide_Based"},
        {label: "Metal_Matrix_Composite"},
        {label: "Al_Matrix"},
        {label: "Beryllium_Matrix"},
        {label: "Cobalt_Matrix"},
        {label: "Cobalt_and_Nickel_Matrix"},
        {label: "Iron_Matrix"},
        {label: "Nickel_Matrix"},
        {label: "Polymer_Matrix_Composite"},
        {label: "Glass"},
        {label: "Glass_Ceramic"},
        {label: "Lead_Glass"},
        {label: "Silicate_Glass"},
        {label: "Metal"},
        {label: "Ferrous"},
        {label: "Alloy_Steel"},
        {label: "AHSS_Steel"},
        {label: "HSLA_Steel"},
        {label: "High_Alloy_Steel"},
        {label: "Low_Alloy_Steel"},
        {label: "Maraging_Steel"},
        {label: "MicroAlloyed_Steel"},
        {label: "Stainless_Steel"},
        {label: "Tool_Steel"},
        {label: "Carbon_Steel"},
        {label: "High_Carbon_Steel"},
        {label: "Low_Carbon_Steel"},
        {label: "Medium_Carbon_Steel"},
        {label: "Cast_Iron"},
        {label: "Alloy_Iron"},
        {label: "Gray_Iron"},
        {label: "White_Iron"},
        {label: "NonFerrous"},
        {label: "Al_Alloy"},
        {label: "Cu_Alloy"},
        {label: "Ni_Alloy"},
        {label: "Pb_Alloy"},
        {label: "Ti_Alloy"},
        {label: "Zn_Alloy"},
        {label: "Polymer"},
        {label: "Elastomer"},
        {label: "BR"},
        {label: "CR"},
        {label: "EPDM"},
        {label: "EPR"},
        {label: "FVMQ"},
        {label: "NBR"},
        {label: "NR"},
        {label: "SBR"},
        {label: "TPE"},
        {label: "SBS"},
        {label: "TPA"},
        {label: "TPC"},
        {label: "TPEE"},
        {label: "TPO"},
        {label: "TPS"},
        {label: "TPU"},
        {label: "TPV"},
        {label: "Thermoplastic"},
        {label: "Acrylic"},
        {label: "Fluoropolymer"},
        {label: "Liquid_Crystal_Polymer_LCP"},
        {label: "Polyamide_PA"},
        {label: "Polyaryletherketone_PAEK"},
        {label: "Polyatic_Acid_PLA"},
        {label: "Polycarbonate_PA"},
        {label: "Polyester"},
        {label: "Polyethylene_PE"},
        {label: "Polyimide_PI"},
        {label: "Thermosetting"},
        {label: "Amino_Resin"},
        {label: "Epoxy_Resin"},
        {label: "Phenol_Formaldehyde_Resin_PF"},
        {label: "Phtalonitrile_PN"},
        {label: "Polyester_Resin_UP"},
        {label: "Vinyl_Ester_Resin_VE"}

    ]

    const app_areas = [
        {label: "Agriculture"},
        {label: "Agricultural_Machines_and_Equipments"},
        {label: "Agricultural_Film"},
        {label: "Agricultural_Machines"},
        {label: "Fertilizer_Plants"},
        {label: "Forestry_Equipment"},
        {label: "Harvesting_Equipment"},
        {label: "Lifestock_Equipment"},
        {label: "Sowing_and_Trailed_Vehicles"},
        {label: "Aquaculture"},
        {label: "Fishing_Equipment"},
        {label: "Automotive"},
        {label: "Commercial_Vehicles"},
        {label: "Trucks_and_Trailers"},
        {label: "General_Automotive_Parts"},
        {label: "Automotive_Structure"},
        {label: "Chassis"},
        {label: "Steering_Wheel"},
        {label: "Sunroof"},
        {label: "Road_Vehicle_Systems"},
        {label: "Road_Vehicles"},
        {label: "Chemical_Industry"},
        {label: "Chemical_Industry_Production"},
        {label: "Equipment_For_Chemical_Industry"},
        {label: "Heat_Exchangers"},
        {label: "Civil_Engineering"},
        {label: "Consumer_Goods"},
        {label: "Domestic"},
        {label: "Commercial_and_Indsutrial_Heating_Appliances"},
        {label: "Electric_Heaters"},
        {label: "Heating_Appliances"},
        {label: "Heating_Elements"},
        {label: "Entertainment"},
        {label: "Camping_Equipment"},
        {label: "Entertainment_Equipment_General"},
        {label: "Musical_Instruments"},
        {label: "Toys"},
        {label: "Shop_Fittings"},
        {label: "Shelving"},
        {label: "Shop_Fittings_General"},
        {label: "Trolleys_for_Supermarket_Purposes"},
        {label: "Defense"},
        {label: "Military_Engineering"},
        {label: "Ballistic_Protection"},
        {label: "Explosives"},
        {label: "General_Military"},
        {label: "Surveillance"},
        {label: "Weapons"},
        {label: "Electrical_Engineering"},
        {label: "Electrical_Accessories"},
        {label: "Thermocouple"},
        {label: "Rotating_Machinery"},
        {label: "Components_for_Rotating_Machinery"},
        {label: "Generators"},
        {label: "Other_Rotating_Machinery_Related_Areas"},
        {label: "Electronics"},
        {label: "Capacitors"},
        {label: "Capacitors_General"},
        {label: "Ceramic_and_Mica_Capacitors"},
        {label: "Super_Capacitors"},
        {label: "Connectors"},
        {label: "Connectors_General"},
        {label: "Indsutrial_Connectors"},
        {label: "Display_Devices"},
        {label: "Piezoelectrics"},
        {label: "Resistors"},
        {label: "Heating_Conductors"},
        {label: "Precision_Resistors"},
        {label: "Thermistors"},
        {label: "Variable_Resistors"},
        {label: "Semiconductor_Devices"},
        {label: "Diodes"},
        {label: "Transistors"},
        {label: "Energy"},
        {label: "Burners_and_Boilers"},
        {label: "Combustion_Engines"},
        {label: "Food_Industry"},
        {label: "Glass_and_Ceramics"},
        {label: "Processes_In_The_Glass_and_Ceramic_Indsutries"},
        {label: "Manufacturing"},
        {label: "Additive_Manufacturing"},
        {label: "Fused_Deposition_Modelling_FDM"},
        {label: "Fused_Filament_Fabrication_FFF"},
        {label: "Laser_Metal_Fusion_LMF"},
        {label: "Selective_Laser_Melting_SLM"},
        {label: "Automation_Systems"},
        {label: "CNC_Machines"},
        {label: "Indsutrial_Robots"},
        {label: "Other_Automation_Systems"},
        {label: "Chipless_Working_Equipment"},
        {label: "Molding_Equipment"},
        {label: "Moulds"},
        {label: "Plates"},
        {label: "Shears"},
        {label: "Forming_Processes"},
        {label: "Heat_Treatment"},
        {label: "Industrial_Furnaces"},
        {label: "Furnace_Parts"},
        {label: "Machining"},
        {label: "Drilling_Machines"},
        {label: "Lathes"},
        {label: "Milling_Machines"},
        {label: "Soldering"},
        {label: "Welding"},
        {label: "Welded_Joints_and_Welds"},
        {label: "Maritime"},
        {label: "Sea_Water_Applications"},
        {label: "Sea_Water_Applications_General"},
        {label: "Material_Handling"},
        {label: "Lifting_Equipment"},
        {label: "Lifting_Appliances_General"},
        {label: "Mechanical_Systems"},
        {label: "Bearings"},
        {label: "Bearings_General"},
        {label: "Plain_Bearings"},
        {label: "Rolling_Bearings"},
        {label: "Belts"},
        {label: "Closures"},
        {label: "Damping"},
        {label: "Fasteners"},
        {label: "Brackets"},
        {label: "Clamps_and_Staples"},
        {label: "Fasteners_General"},
        {label: "Hook_and_Loop_Fasteners"},
        {label: "Pins_and_Nails"},
        {label: "Rings"},
        {label: "Washers"},
        {label: "Fittings"},
        {label: "Flexible_Drives"},
        {label: "Gears"},
        {label: "Hinges"},
        {label: "Housings"},
        {label: "Industrial_Machinery"},
        {label: "Rollers"},
        {label: "Shafs_and_Couplings"},
        {label: "Couplings"},
        {label: "Other_Shafts_and_Couplings"},
        {label: "Springs"},
        {label: "Transmissions"},
        {label: "Clutch_Facings"},
        {label: "Metallurgy"},
        {label: "Equipment_For_The_Metallurgical_Indsutry"},
        {label: "Iron_and_Steel_Products"},
        {label: "Steel_Pipes_and_Tubes"},
        {label: "Mining_Industry"},
        {label: "Minerals_Processing"},
        {label: "Mining_Equipment"},
        {label: "Drilling_and_Mine_Excavation"},
        {label: "Haulage_and_Hoisting"},
        {label: "Mining_Equipment_General"},
        {label: "Tunneling_and_Tubing"},
        {label: "Oil_and_Gas_Industry"},
        {label: "Equipment_For_Petroleum_and_Natural_Gas_Industry"},
        {label: "Processing_Equipment"},
        {label: "Optics_and_Imaging"},
        {label: "Document_Imaging"},
        {label: "Photography"},
        {label: "Telescopes"},
        {label: "Wood_Technology"},
        {label: "Woodworking_Equipment"},
        {label: "Woodworking_Equipment_in_General"},
        {label: "Woodworking_Machinery"}
    ]

    const less = "<"

    const greater = ">"

    const equalss = "="

    



  return (
    <Container >
        <Grid justifyContent="flex-start" alignItems="center" container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}></Grid>
            
            <Grid item xs={3}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"                    
                    options={material_type_all}
                    onChange={handleChangeMat_type}                    
                    renderInput={(params) => <TextField {...params} label="Material Type" />}
                />
            </Grid>
            <Grid item xs="auto" sx={{minWidth:240}}>
                <TextField id="outlined-basic" label="Material Name" variant="outlined" 
                    size="small" onChange={handleMaterial_name}
                    
                />
            
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size = "small"
                    options={producers}
                    onChange={handleChangeprod_name}                    
                    renderInput={(params) => <TextField {...params} label="Producer" />}
                />
            </Grid>
            <Grid item xs={3}>
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size = "small"
                    options={locations}
                    onChange={handleChangeprod_loc}                    
                    renderInput={(params) => <TextField {...params} label="Producer Location" />}
                />
            </Grid>
            <Grid item xs={3}>
                
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size = "small"
                    options={properties}     
                    onChange={handleChangeprop}              
                    renderInput={(params) => <TextField {...params} label="Select Property" />}
                />
                
            </Grid>
            <Grid item xs={1} >
            <FormControl sx={{ minWidth:80}}>
                <InputLabel id="demo-simple-select-label">Compare</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size = "small"
                    value={comp}
                    label="Compare"
                    onChange={handleChangeComp}
                >
                    <MenuItem value={greater}> {greater}</MenuItem>
                    <MenuItem value={less}> {less} </MenuItem>
                    <MenuItem value={equalss}>{equalss}</MenuItem>
                </Select>
            </FormControl>
            </Grid>
            <Grid item xs={3}>
                <TextField id="outlined-basic" label="Enter Value" variant="outlined" 
                    size = "small" onChange={handleComparisonInput}
                />
            </Grid>
            <Grid item xs={3}>
                
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size = "small"
                    options={app_areas}
                    onChange={handleChangeapp_area}
                    renderInput={(params) => <TextField {...params} label="Application Area" />}
                />
                
            </Grid>

            <Grid item xs={1} sx={{ minWidth:100}} >
                <Button variant="outlined" color="success"
                    onClick={handleSubmit} >Search
                </Button>
            </Grid>

            <Grid item xs={12}>
                <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Material Name</TableCell>
                                    <TableCell align="right">Property</TableCell>
                                    <TableCell align="right">Value&nbsp;(Unit)</TableCell>
                                    <TableCell align="right">Application Area</TableCell>
                                    <TableCell align="right">Producer</TableCell>                                    
                                    <TableCell align="right">Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {responseData.map((responseDataInd, i) => (
                                <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                <TableCell component="th" scope="row" >
                                    {responseDataInd.name.value}
                                </TableCell>
                                <TableCell align="right">{property}</TableCell>
                                <TableCell align="right">{responseDataInd.value_unit.value}</TableCell>
                                <TableCell align="right">{responseDataInd.Application_Areas.value}</TableCell>
                                <TableCell align="right">{responseDataInd.producer.value}</TableCell>     
                                <TableCell align="right">{responseDataInd.Locations.value}</TableCell>                        
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            {/* <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Material Name</TableCell>
            <TableCell align="right">Property</TableCell>
            <TableCell align="right">Value&nbsp;(Unit)</TableCell>
            <TableCell align="right">Producer</TableCell>
            <TableCell align="right">Application Area</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {app_areas.map((app_areas) => (
            <TableRow
              key={app_areas.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" onClick={handleOpen}>
                Real NAME
              </TableCell>
                <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Text in a modal
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                        </Typography>
                        </Box>
                    </Modal>
              <TableCell align="right" >Name</TableCell>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx= {{backgroundColor: 'transparent'}}
                >
                    <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Material Name
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                    </Box>
                </Modal>
              <TableCell align="right">{app_areas.fat}</TableCell>
              <TableCell align="right">{app_areas.carbs}</TableCell>
              <TableCell align="right">{app_areas.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer> */}
            </Grid>
            

        </Grid>


    </Container>
  )
}
