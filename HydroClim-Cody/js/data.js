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
    { name: 'bcc-csm1-1.1', id: 3, description: 'Beijing Climate Center,China Meteorological Administration', country: 'China' },
    { name: 'canesm2.1', id: 5, description: 'Canadian Centre for Climate Modelling and Analysis', country: 'Canada' },
    { name: 'ccsm4.1', id: 7, description: 'National Center for Atmospheric Research', country: 'USA' },
    { name: 'cesm1-bgc.1', id: 9, description: 'Community Earth System Model Contributors', country: 'USA' },
    { name: 'cnrm-cm5.1', id: 11, description: 'Centre National de Recherches Météorologiques/Centre Européen de Recherche et Formation Avancée en Calcul Scientifique', country: 'France' },
    { name: 'csiro-mk3-6-0.1', id: 13, description: 'Commonwealth Scientific and Industrial Research Organization,Queensland Climate Change Centre of Excellence', country: 'Australia' },
    { name: 'gfdl-esm2g.1', id: 16, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2m.1', id: 18, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'inmcm4.1', id: 20, description: 'Institute for Numerical Mathematics', country: 'Russia' },
    { name: 'ipsl-cm5a-lr.1', id: 22, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'ipsl-cm5a-mr.1', id: 24, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'miroc5.1', id: 26, description: 'Atmosphere and Ocean Research Institute (The University of Tokyo),National Institute for Environmental Studies,and Japan Agency for Marine-Earth Science and Technology', country: 'Japan' },
    { name: 'miroc-esm.1', id: 28, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'miroc-esm-chem.1', id: 30, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'mpi-esm-lr.1', id: 32, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mpi-esm-mr.1', id: 34, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mri-cgcm3.1', id: 36, description: 'Meteorological Research Institute', country: 'Japan' },
    { name: 'noresm1-m.1', id: 38, description: 'Norwegian Climate Centre', country: 'Norway' }
];
var modelsList85 = [
    { name: 'access1-0.1', id: 2, description: 'Commonwealth Scientific and Industrial Research Organization and Bureau of Meterology,Australia', country: 'Australia' },
    { name: 'bcc-csm1-1.1', id: 4, description: 'Beijing Climate Center,China Meteorological Administration', country: 'China' },
    { name: 'canesm2.1', id: 6, description: 'Canadian Centre for Climate Modelling and Analysis', country: 'Canada' },
    { name: 'ccsm4.1', id: 8, description: 'National Center for Atmospheric Research', country: 'USA' },
    { name: 'cesm1-bgc.1', id: 10, description: 'Community Earth System Model Contributors', country: 'USA' },
    { name: 'cnrm-cm5.1', id: 12, description: 'Centre National de Recherches Météorologiques/Centre Européen de Recherche et Formation Avancée en Calcul Scientifique', country: 'France' },
    { name: 'csiro-mk3-6-0.1', id: 14, description: 'Commonwealth Scientific and Industrial Research Organization,Queensland Climate Change Centre of Excellence', country: 'Australia' },
    { name: 'gfdl-cm3.1', id: 15, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2g.1', id: 17, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'gfdl-esm2m.1', id: 19, description: 'NOAA Geophysical Fluid Dynamics Laboratory', country: 'USA' },
    { name: 'inmcm4.1', id: 21, description: 'Institute for Numerical Mathematics', country: 'Russia' },
    { name: 'ipsl-cm5a-lr.1', id: 23, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'ipsl-cm5a-mr.1', id: 25, description: 'Institut Pierre-Simon Laplace', country: 'France' },
    { name: 'miroc5.1', id: 27, description: 'Atmosphere and Ocean Research Institute (The University of Tokyo),National Institute for Environmental Studies,and Japan Agency for Marine-Earth Science and Technology', country: 'Japan' },
    { name: 'miroc-esm.1', id: 29, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'miroc-esm-chem.1', id: 31, description: 'Japan Agency for Marine-Earth Science and Technology,Atmosphere and Ocean Research Institute (The University of Tokyo),and National Institute for Environmental Studies', country: 'Japan' },
    { name: 'mpi-esm-lr.1', id: 33, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mpi-esm-mr.1', id: 35, description: 'Max-Planck-Institut für Meteorologie (Max Planck Institute for Meteorology)', country: 'Germany' },
    { name: 'mri-cgcm3.1', id: 37, description: 'Meteorological Research Institute', country: 'Japan' },
    { name: 'noresm1-m.1', id: 39, description: 'Norwegian Climate Centre', country: 'Norway' }
];

var basins = [
    { name: 'Mobile River Basin', id: 1 },
    { name: 'Colorado River Basin', id: 2 },
    { name: 'Upper Mississipi River Basin', id: 3 },
    { name: 'Suwannee River Basin', id: 4 },
    { name: 'Apalachicola River Basin', id: 5 },
    { name: 'Ohio River Basin', id: 6 },
    { name: 'Sabine River Basin', id: 7 }
]