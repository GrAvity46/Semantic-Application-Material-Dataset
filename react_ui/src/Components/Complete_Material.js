import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container } from '@mui/system';
import { Grid , Paper } from '@mui/material';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';
import { useEffect } from 'react';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';


export const Complete_Material = () => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const darkTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });
    
    const [general_Types, setGeneral_Types] = useState([]);

    const [general_types_array, setGeneral_types_array] = useState([])

    const [comp, setComp] = useState()
    const [comp_f, setComp_f] = useState(comp)
    const [material_type, setMaterial_type] = useState()
    const [producer_loc, setProducer_loc] = useState()
    const [producer_name, setProducer_name] = useState()
    const [property, setProperty] = useState()
    const [app_area, setApp_area] = useState()
    const [material_name, setMaterial_name] = useState()
    const [responseData, setResponseData] = useState([])
    const [responseData_app, setResponseData_app] = useState([])
    const [responseData_mat, setResponseData_mat] = useState([])
    const [responseData_chem, setResponseData_chem] = useState([])
    const [comparisonInput, setComparisonInput] = useState()
    
    
    
    

    const handleSubmit = () => {
        
        axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX ma: <http://www.w3.org/ns/ma-ont#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?prop_name ?measure  ?condition ?min_value  ?unitname   WHERE {
                        
            ?x a ?y.
            ?y rdfs:subClassOf* material:Eng_Material.
            ?x material:has_name ?name
            FILTER(?name = "${material_name}")
            ?x material:has_Material_Property ?c .
            ?c material:has_Measurement ?measure .
            ?c material:has_name ?prop_name .
            ?measure material:has_min_value ?min_value .
            ?measure material:has_unit ?unit .
            ?unit material:has_name ?unitname .
            OPTIONAL {?measure material:has_max_value ?first. }.
            OPTIONAL {?measure material:has_condition ?condition .}
            OPTIONAL {?measure material:has_comment ?comment}            
            }
            `}}).then(response => {

                /* for(var i = 0; i < response.data.results.bindings.length; i++){
                    console.log(response.data.results.bindings[i])
                    if((response.data.results.bindings[i].comment == null)){
                        console.log('IF NULL ENTER: ', response.data.results.bindings[i])
                        var response = {prop_name:{value: response.data.results.bindings[i].prop_name.value}, 
                        measure:{value: response.data.results.bindings[i].measure.value},
                        condition:{value: response.data.results.bindings[i].condition.value},
                        min_value:{value: response.data.results.bindings[i].min_value.value},
                        unitname:{value: response.data.results.bindings[i].unitname.value},
                        comment:{value: ""}
                                        }
                        
                        middle_man.push(response)
                        console.log('IF NULL: ', response)
                    
                    }
                    else{
                        console.log('IF NOT NULL: ', response.data.results.bindings[i])
                        middle_man.push(response.data.results.bindings[i])
                    }
                    
                } */
                setResponseData(response.data.results.bindings)
                
            })
            axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX ma: <http://www.w3.org/ns/ma-ont#>
            PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT  ?name (GROUP_CONCAT(DISTINCT ?app_name; SEPARATOR=", ") AS ?Application_Areas)  WHERE {
                        
            ?x a ?y.
            ?y rdfs:subClassOf* material:Eng_Material.
            ?x material:has_name ?name
            FILTER(?name = "${material_name}")
            ?x material:has_Application_Area ?c .
            ?c material:has_name ?app_name .            
            } GROUP BY ?name
            `}}).then(response => {

                setResponseData_app(response.data.results.bindings)
                
            })

            axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT DISTINCT ?name ?descr ?url (GROUP_CONCAT( ?loc; SEPARATOR=", ") AS ?Location) WHERE {
            ?prod a material:Producer .
            ?prod material:has_name ?name .
            ?prod material:has_description ?descr .
            ?prod material:has_Location ?lo .
            ?lo material:has_name ?loc .
            ?prod material:has_url ?url .
            ?prod material:produces ?mat .
            ?mat material:has_name ?mat_name
            FILTER(?mat_name = "${material_name}")

            }
            GROUP BY ?name ?descr ?url


            `}}).then(response => {
                setResponseData_mat(response.data.results.bindings)
                
            })

            axios.get('http://localhost:3030/Engineering_Materials_OWL_V1.2.owl/', 
            {params: {query: `
            PREFIX material: <urn:absolute:Engineering_Materials_OWL_V1.2#>
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
            PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
            SELECT DISTINCT ?name (CONCAT(?value," ", ?unitname) as ?value_unit)  WHERE {
            ?Che a material:Chemical_Composition .
            ?Che material:has_Element_Couple ?EC .
            ?EC material:has_Element ?El .
            ?El material:has_name ?name .
            ?EC material:has_value ?value .
            ?EC material:has_unit ?u .
            ?u material:has_name ?unitname .
            ?EC material:has_comment ?comm .
            ?Che material:belongs_to ?mat .
            ?mat material:has_name ?mat_name
            FILTER(?mat_name = "${material_name}")

            }
            ORDER BY ?name
            `}}).then(response => {
                
                setResponseData_chem(response.data.results.bindings)
                
            })
            
        
    }

    const handleMaterial_name = (event) => {
        setMaterial_name(event.target.value)
        console.log('Material Name: ', event.target.value)
    }

    const handleComparisonInput = (event) => {
        setComparisonInput(event.target.value)
        console.log('Comparison Input: ', event.target.value)
    }

   
    
    
    
    

    
    

   

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

    

   

    



  return (
    <Container >
        <Grid justifyContent="flex-start" alignItems="center" container spacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12}></Grid>
            
            
            
            <Grid item xs="auto" sx={{minWidth:240}}>
                <TextField id="outlined-basic" label="Material Name" variant="outlined" 
                    size="small" onChange={handleMaterial_name}
                    
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
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                Material Data
                                </Typography>
                                <TableRow>
                                    <TableCell>Property</TableCell>
                                    <TableCell align="right">Value</TableCell>                                   
                                    <TableCell align="right">Unit</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {responseData.map((responseDataInd, i) => (
                                <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.prop_name.value}
                                    </TableCell>
                                    {/* <TableCell component="th" scope="row" >
                                        {responseDataInd.condition.value}
                                    </TableCell> */}
                                    <TableCell component="th" scope="row" align="right" >
                                        {responseDataInd.min_value.value}
                                    </TableCell>
                                    <TableCell align="right">{responseDataInd.unitname.value}</TableCell>     
                                    
                                    {/* <TableCell component="th" scope="row" >
                                        {responseDataInd.comment.value}
                                    </TableCell> */}
                                    
                                                           
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Grid>
            
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                Material Chemical Composition
                                </Typography>
                                <TableRow>
                                    <TableCell>Element</TableCell>
                                    <TableCell align="right">Value&nbsp;(Unit)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {responseData_chem.map((responseDataInd, i) => (
                                <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.name.value}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right" >
                                        {responseDataInd.value_unit.value}
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                Application Araes
                                </Typography>
                                <TableRow>
                                    <TableCell>Material Name</TableCell>
                                    <TableCell align="right">Application Areas</TableCell>                                   
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {responseData_app.map((responseDataInd, i) => (
                                <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.name.value}
                                    </TableCell>
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.Application_Areas.value}
                                    </TableCell>           
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Grid>
            <Grid item xs={12}>
                <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <Typography id="modal-modal-title" variant="h6" component="h2" align="center">
                                Material Producer Data
                                </Typography>
                                <TableRow>
                                    <TableCell>Producer Name</TableCell>
                                    <TableCell align="right">Description</TableCell>                                   
                                    <TableCell align="right">URL</TableCell>
                                    <TableCell align="right">Location</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {responseData_mat.map((responseDataInd, i) => (
                                <TableRow
                                key={i}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.name.value}
                                    </TableCell>
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.descr.value}
                                    </TableCell>
                                    <TableCell component="th" scope="row" align="right" >
                                        {responseDataInd.url.value}
                                    </TableCell>
                                     
                                    
                                    <TableCell component="th" scope="row" >
                                        {responseDataInd.Location.value}
                                    </TableCell>
                                    
                                                           
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
            </Grid>
            

        </Grid>


    </Container>
  )
}
