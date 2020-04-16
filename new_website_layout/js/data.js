var hydroclimStyles = [
    { name: "Temp and Flow", value: "hydroclim:temp_flow_5_degree" },
    { name: "Temp and Flow Lowest", value: "hydroclim:temp_and_flow_low" },
    { name: "Temp and Flow Highest", value: "hydroclim:temp_and_flow_high" },
    { name: "Temperature", value: "hydroclim:temperature" },
    { name: "Flow", value: "hydroclim:flow_only" },
    { name: "Flow Lowest", value: "hydroclim:flow_only_low" },
    { name: "Flow Highest", value: "hydroclim:flow_only_high" }
];

var months = [{ name: "January", value: 1 }, { name: "February", value: 2 }, { name: "March", value: 3 }, { name: "April", value: 4 }, { name: "May", value: 5 }, { name: "June", value: 6 }, { name: "July", value: 7 }, { name: "August", value: 8 }, { name: "September", value: 9 }, { name: "October", value: 10 }, { name: "November", value: 11 }, { name: "December", value: 12 }];
var seasons = [{ name: "Spring", value: 'spring' }, { name: "Summer", value: 'summer' }, { name: "Autumn", value: 'autumn' }, { name: "Winter", value: 'winter' }];

var modelsList45 = [
    { name: 'access1-0.1', id: 1, description: 'Commonwealth Scientific and Industrial Research Organization and Bureau of Meterology,Australia', country: 'Australia' },
    { name: 'bcc-csm1-1.1', id: 2, description: 'Beijing Climate Center,China Meteorological Administration', country: 'China' },
    { name: 'canesm2.1', id: 3, description: 'Canadian Centre for Climate Modelling and Analysis', country: 'Canada' },
    { name: 'ccsm4.1', id: 4, description: 'National Center for Atmospheric Research', country: 'USA' },
    { name: 'cesm1-bgc.1', id: 5, description: 'Community Earth System Model Contributors', country: 'USA' },
    { name: 'cnrm-cm5.1', id: 6, description: 'Centre National de Recherches Météorologiques/Centre Européen de Recherche et Formation Avancée en Calcul Scientifique', country: 'France' },
    { name: 'csiro-mk3-6-0.1', id: 7, description: 'Commonwealth Scientific and Industrial Research Organization,Queensland Climate Change Centre of Excellence', country: 'Australia' },
    { name: 'gfdl-esm2g.1', id: 8, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2m.1', id: 9, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'inmcm4.1', id: 10, description: 'Institute for Numerical Mathematics', country: 'Russia' },
    { name: 'ipsl-cm5a-lr.1', id: 11, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'ipsl-cm5a-mr.1', id: 12, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'miroc5.1', id: 13, description: 'Atmosphere and Ocean Research Institute (The University of Tokyo),National Institute for Environmental Studies,and Japan Agency for Marine-Earth Science and Technology', country: 'Japan' },
    { name: 'miroc-esm.1', id: 14, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'miroc-esm-chem.1', id: 15, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'mpi-esm-lr.1', id: 16, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mpi-esm-mr.1', id: 17, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mri-cgcm3.1', id: 18, description: 'Meteorological Research Institute', country: 'Japan' },
    { name: 'noresm1-m.1', id: 19, description: 'Norwegian Climate Centre', country: 'Norway' }
];
var modelsList85 = [
    { name: 'access1-0.1', id: 20, description: 'Commonwealth Scientific and Industrial Research Organization and Bureau of Meterology,Australia', country: 'Australia' },
    { name: 'bcc-csm1-1.1', id: 21, description: 'Beijing Climate Center,China Meteorological Administration', country: 'China' },
    { name: 'canesm2.1', id: 22, description: 'Canadian Centre for Climate Modelling and Analysis', country: 'Canada' },
    { name: 'ccsm4.1', id: 23, description: 'National Center for Atmospheric Research', country: 'USA' },
    { name: 'cesm1-bgc.1', id: 24, description: 'Community Earth System Model Contributors', country: 'USA' },
    { name: 'cnrm-cm5.1', id: 25, description: 'Centre National de Recherches Météorologiques/Centre Européen de Recherche et Formation Avancée en Calcul Scientifique', country: 'France' },
    { name: 'csiro-mk3-6-0.1', id: 26, description: 'Commonwealth Scientific and Industrial Research Organization,Queensland Climate Change Centre of Excellence', country: 'Australia' },
    { name: 'gfdl-cm3.1', id: 27, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2g.1', id: 28, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2m.1', id: 29, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'inmcm4.1', id: 30, description: 'Institute for Numerical Mathematics', country: 'Russia' },
    { name: 'ipsl-cm5a-lr.1', id: 31, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'ipsl-cm5a-mr.1', id: 32, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'miroc5.1', id: 33, description: 'Atmosphere and Ocean Research Institute (The University of Tokyo),National Institute for Environmental Studies,and Japan Agency for Marine-Earth Science and Technology', country: 'Japan' },
    { name: 'miroc-esm.1', id: 34, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'miroc-esm-chem.1', id: 35, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'mpi-esm-lr.1', id: 36, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mpi-esm-mr.1', id: 37, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mri-cgcm3.1', id: 38, description: 'Meteorological Research Institute', country: 'Japan' },
    { name: 'noresm1-m.1', id: 39, description: 'Norwegian Climate Centre', country: 'Norway' }
];

var basins = [
    { name: ' Apalachicola River Basin', id: 1 },
    { name: ' Arkansas-White-Red River Basin', id: 2 },
    { name: ' Brazos River Basin', id: 3 },
    { name: ' CapeFear_PeeDee_Edisto_Santee', id: 4 },
    { name: ' Chesapeake', id: 5 },
    { name: ' Colorado River Basin', id: 6 },
    { name: ' Columbia River Basin', id: 7 },
    { name: ' Delaware', id: 8 },
    { name: ' Florida_Ochlockonee Bay', id: 9 },
    { name: ' Florida_Pensacola Bay', id: 10 },
    { name: ' Florida_Southeast', id: 11 },
    { name: ' Florida_Southwest', id: 12 },
    //{ name: ' Great Salt Lake', id: 13 },
    { name: ' Hudson', id: 14 },
    //{ name: ' Humboldt River Basin', id: 15 },
    { name: ' Maine_bay', id: 16 },
    { name: ' Massachusetts bay', id: 17 },
    { name: ' Missouri River Basin', id: 18 },
    { name: ' Mobile River Basin', id: 19 },
    { name: ' Ohio River Basin', id: 20 },
    { name: ' Rio Grande River Basin', id: 21 },
    { name: ' Sacramento_basin', id: 22 },
    { name: ' San_Joaquin', id: 23 },
    { name: ' Satilla_and_Altamaha_River', id: 24 },
    { name: ' Suwannee River Basin', id: 25 },
    { name: ' Trinity-Neches-Sabine River Basin', id: 26 },
    { name: ' Upper Mississippi River Basin', id: 27 },
    { name: ' Albermarle_Pamlico_sounds', id: 28 }
]