from models import Basin_info, Basin, Reach, ReachData, RecordDateData

from db import session
from flask import jsonify, Response
from io import BytesIO
import zipfile, time, config, os
from resources_data import basinlist, rcp45list, rcp85list

from flask_restplus import reqparse, abort, Resource, fields, marshal_with
from flask_restful import inputs
from sqlalchemy import func, or_, and_
# import geoalchemy2,shapely
from shapely.geometry import geo
from geoalchemy2 import functions
from geoalchemy2.shape import to_shape

# ==========Basin ==================
basin_info_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}
basin_fields = {
    'OBJECTID': fields.Integer,
    'disID': fields.Float,
    'Shape_Leng': fields.Float,
    'Shape_Area': fields.Float,
    'geom': fields.String,
    'basin_info_id': fields.Integer
    # 'basin_shp_id': fields.Integer
}
parser = reqparse.RequestParser()
parser.add_argument('basininfo', type=str)


# def returnBasinDict():
#     basinlist = session.query(Basin_info).all()
#     basinDict = {}
#     for i in range(0, len(basinlist)):
#         item = basinlist[i]
#         basinDict[item.id] = item.name[0]
#     return basinDict


class BasininfoResource(Resource):
    """
    Get Basin information by Basin ID.
    @url: /basininfo/<string:id>
    @method: GET
    @param id: basin information id
    @return: Basin information
    @return-type: JSON
    @raise keyError: raises an exception
    """

    @marshal_with(basin_info_fields)
    def get(self, id):
        basinfo = session.query(Basin_info).filter(Basin_info.id == id).first()
        if not basinfo:
            abort(404, message="Basin_Info {} doesn't exist".format(id))
        return basinfo

    """
    Delete Basin information by Basin ID.
    @url: /basininfo/<string:id>
    @method: DELETE
    @param id: basin information id
    @return: Basin information 
    @return-type: JSON
    @raise keyError: raises an exception
    """

    def delete(self, id):
        basinfo = session.query(Basin_info).filter(Basin_info.id == id).first()
        if not basinfo:
            abort(404, message="Basin_Info {} doesn't exist".format(id))
        session.delete(basinfo)
        session.commit()
        return {}, 204


class BasinListResource(Resource):
    """
    Get a list of Basin information
    @url: /basinlist
    @method: GET
    @return: List of Basin information
    @return-type: JSON
    @raise keyError: raises an exception
    """

    @marshal_with(basin_info_fields)
    def get(self):
        basinlists = session.query(Basin_info).all()
        return basinlists


class BasinResource(Resource):
    """
    Return geojson of Basins
    @url: /basin
    @return: GeoJSON of Basin information
    @return-type: GeoJSON
    @raise keyError: raises an exception
    """

    def get(self):
        # basins = session.scalar(functions.ST_AsGeoJSON(Basin.geom))
        smapping = geo.mapping
        basins = session.query(Basin).all()
        data = [{"geometry": {"coordinates": smapping(to_shape(basin.geom))["coordinates"],
                              "type": "MultiPolygon"
                              },
                 "type": "Feature",
                 "properties": {"basin_info_id": basin.basin_info_id},
                 } for basin in basins]
        return jsonify({"features": data, "type": "FeatureCollection"})


parser.add_argument('X', type=float)
parser.add_argument('Y', type=float)


class ReachResource(Resource):
    """
     Return geojson of Reaches by location, if location is None, return all of the reaches features.
     @url: /basin
     @param X(option): Longtitue
     @param Y(option): Latitue
     @return: GeoJSON of Reaches information
     @return-type: GeoJSON
     @raise keyError: raises an exception
     """

    def get(self):
        # basins = session.scalar(functions.ST_AsGeoJSON(Basin.geom))
        args = parser.parse_args()
        if args['X'] is not None:
            x = args['X']
            y = args['Y']
            geom = 'SRID=4326;POINT({0} {1})'.format(y, x)
            basinquery = session.query(Basin.basin_info_id).filter(functions.ST_Contains(Basin.geom, geom)).all();
            if len(basinquery) != 0:
                basin_id = basinquery[0].basin_info_id
                smapping = geo.mapping
                # reaches= session.query(Reach.OBJECTID,functions.ST_Transform(Reach.geom,4326)).filter(Reach.OBJECTID == 80).all()
                reaches = session.query(functions.ST_Transform(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID,
                                        Reach.GRID_CODE, Reach.AreaC, Reach.Dep2, Reach.FROM_NODE, Reach.TO_NODE,
                                        Reach.HydroID, Reach.Len2, Reach.MaxEl, Reach.Len2, Reach.MinEl, Reach.OutletID,
                                        Reach.Shape_Leng, Reach.Slo2, Reach.Subbasin, Reach.SubbasinR, Reach.Wid2,
                                        ).filter(Reach.basin_id == basin_id).all()
                data = [{"type": "Feature",
                         "properties": {"OBJECTID": reach.OBJECTID,
                                        "ARCID": reach.ARCID,
                                        "GRID_CODE": reach.GRID_CODE,
                                        "AreaC": reach.AreaC,
                                        "Dep2": reach.Dep2,
                                        "FROM_NODE": reach.FROM_NODE,
                                        "TO_NODE": reach.TO_NODE,
                                        "HydroID": reach.HydroID,
                                        "Len2": reach.Len2,
                                        "MaxEl": reach.MaxEl,
                                        "Len2": reach.Len2,
                                        "MinEl": reach.MinEl,
                                        "OutletID": reach.OutletID,
                                        "Shape_Leng": reach.Shape_Leng,
                                        "Slo2": reach.Slo2,
                                        "Subbasin": reach.Subbasin,
                                        "SubbasinR": reach.SubbasinR,
                                        "Wid2": reach.Wid2
                                        },
                         "geometry": {"type": "LineString",
                                      "coordinates": smapping(to_shape(reach[0]))["coordinates"]
                                      },
                         } for reach in reaches]
                json = jsonify({"type": "FeatureCollection", "features": data})
                return json
            else:
                return jsonify({})
        else:
            smapping = geo.mapping
            # reaches= session.query(Reach.OBJECTID,functions.ST_Transform(Reach.geom,4326)).filter(Reach.OBJECTID == 80).all()
            reaches = session.query(Reach.OBJECTID, functions.ST_Transform(Reach.geom, 4326)).all()
            data = [{"type": "Feature",
                     "properties": {"OBJECTID": reach.OBJECTID},
                     "geometry": {"type": "LineString",
                                  "coordinates": smapping(to_shape(reach[1]))["coordinates"]
                                  },
                     } for reach in reaches]
            json = jsonify({"type": "FeatureCollection", "features": data})
            return json


parser.add_argument('monthstart', type=int)
parser.add_argument('monthend', type=int)
parser.add_argument('yearstart', type=int)
parser.add_argument('yearend', type=int)
parser.add_argument('basin_id', type=int)
parser.add_argument('isobserved', type=bool)
parser.add_argument('model_id', type=int)


class getReachData(Resource):
    """
    Return csv of reaches temp&flow information
    @url: /reachdata
    @method: GET
    @return: csv of temp&flow information
    @return-type: csv
    @raise keyError: raises an exception
    """

    def get(self):
        args = parser.parse_args()
        yearstart = args['yearstart']
        yearend = args['yearend']
        monthstart = args['monthstart']
        monthend = args['monthend']
        basinid = args['basin_id']
        model_id = args['model_id']
        # isobserved = True if args['isobserved'] == 'off' else False
        smapping = geo.mapping
        reaches = session.query(functions.ST_Transform(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID, Reach.Shape_Leng,
                                ReachData, RecordDateData).join(ReachData, Reach.id == ReachData.rch).join(
            RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
            filter(RecordDateData.year >= yearstart). \
            filter(RecordDateData.year <= yearend). \
            filter(RecordDateData.month >= monthstart). \
            filter(RecordDateData.month <= monthend). \
            filter(ReachData.basin_id == basinid). \
            filter(ReachData.model_id == model_id).all();
        # filter(RecordDateData.year == 1950).filter(RecordDateData.month == 1).all()
        data = [{"type": "Feature",
                 "properties": {"OBJECTID": reach.OBJECTID,
                                "ARCID": reach.ARCID,
                                # "GRID_CODE": reach.GRID_CODE,
                                # "AreaC": reach.AreaC,
                                # "Dep2": reach.Dep2,
                                # "FROM_NODE": reach.FROM_NODE,
                                # "TO_NODE": reach.TO_NODE,
                                # "HydroID": reach.HydroID,
                                # "Len2": reach.Len2,
                                # "MaxEl": reach.MaxEl,
                                # "Len2": reach.Len2,
                                # "MinEl": reach.MinEl,
                                # "OutletID": reach.OutletID,
                                "Shape_Leng": reach.Shape_Leng,
                                # "Slo2": reach.Slo2,
                                # "Subbasin": reach.Subbasin,
                                # "SubbasinR": reach.SubbasinR,
                                # "Wid2": reach.Wid2,
                                "temp": reach.ReachData.wtmpdegc,
                                "discharge": reach.ReachData.flow_outcms
                                },
                 "geometry": {"type": "LineString",
                              "coordinates": smapping(to_shape(reach[0]))["coordinates"]
                              },
                 } for reach in reaches]
        json = jsonify({"type": "FeatureCollection", "features": data})
        return json

class getAllReachData(Resource):
    """
    Return csv of reaches temp&flow information
    @url: /getallreachdata
    @method: GET
    @return: geojson of all basin avg temp&flow information
    @return-type: geojson
    @raise keyError: raises an exception
    """
    parser.add_argument('timerangetype', type=int)
    parser.add_argument('model_id', type=int)
    parser.add_argument('isobserved', type=str)

    def get(self):
        args = parser.parse_args()
        yearstart = args['yearstart']
        yearend = args['yearend']
        monthstart = args['monthstart']
        monthend = args['monthend']
        basin_id = args['basin_id']
        basinids = "1_3".split("_")
        model_id = args['model_id']
        timerangetype = 'subset' if args['timerangetype'] == 1 else 'full'  ## subset:1, full:2
        # isobserved = True if args['isobserved'] == 'off' else False
        smapping = geo.mapping
        # reaches = session.query(functions.ST_Transform(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID, Reach.Shape_Leng,
        #                         ReachData, RecordDateData).join(ReachData, Reach.id == ReachData.rch).join(
        #     RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
        #     filter(RecordDateData.year >= yearstart). \
        #     filter(RecordDateData.year <= yearend). \
        #     filter(RecordDateData.month >= monthstart). \
        #     filter(RecordDateData.month <= monthend). \
        #     filter(ReachData.basin_id == basinid). \
        #     filter(ReachData.model_id == model_id).all();
        #     subquery 1: inner join RecordDate and ReachData by reach id; filter data by time, model, basin etc.
        alldata=[]
        for basinid in basinids :
            if timerangetype == 'subset':
                subq1 = (
                    session.query(ReachData).join(RecordDateData,
                                                  ReachData.record_month_year_id == RecordDateData.id).filter(
                        RecordDateData.year >= yearstart). \
                        filter(RecordDateData.year <= yearend). \
                        filter(RecordDateData.month >= monthstart). \
                        filter(RecordDateData.month <= monthend). \
                        filter(ReachData.basin_id == basinid). \
                        filter(ReachData.model_id == model_id)).subquery()
            else:
                subq1 = (
                    session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
                        filter(
                        ((RecordDateData.year == yearstart) & (RecordDateData.month >= monthstart)).self_group() | (
                                (RecordDateData.year == yearend) & (RecordDateData.month <= monthend)).self_group() | (
                                (RecordDateData.year > yearstart) & (RecordDateData.year < yearend)).self_group()). \
                        filter(ReachData.basin_id == basinid). \
                        filter(ReachData.model_id == model_id)).subquery()
            #    subquery 2: get all statisc value of temp and flow
            subq = (session.query(
                subq1.c.rch,
                func.avg(subq1.c.flow_outcms).label("avg_flow_outcms"),
                func.avg(subq1.c.wtmpdegc).label("avg_wtmpdegc"))
                    .group_by(subq1.c.rch)).subquery()
            #   main query: inner join subquery 2 and reach by reach id; filter by basin id
            reaches = session.query(subq.c.avg_wtmpdegc, subq.c.avg_flow_outcms, Reach.OBJECTID.label("reachid"),
                                functions.ST_Transform(Reach.geom, 4326), Reach.ARCID.label("ARCID"), Reach.GRID_CODE,
                                Reach.FROM_NODE,
                                Reach.TO_NODE, Reach.AreaC, Reach.Len2, Reach.Slo2, Reach.Wid2, Reach.Dep2, Reach.MinEl,
                                Reach.MaxEl, Reach.Shape_Leng, Reach.HydroID, Reach.OutletID, Reach.basin_id).join(subq,
                                                                                                   Reach.OBJECTID == subq.c.rch).filter(
                Reach.basin_id == basinid).all()
            # filter(RecordDateData.year == 1950).filter(RecordDateData.month == 1).all()
            data = [{"type": "Feature",
                     "properties": {"OBJECTID": reach.reachid,
                                    "ARCID": reach.ARCID,
                                    # "GRID_CODE": reach.GRID_CODE,
                                    # "AreaC": reach.AreaC,
                                    # "Dep2": reach.Dep2,
                                    # "FROM_NODE": reach.FROM_NODE,
                                    # "TO_NODE": reach.TO_NODE,
                                    # "HydroID": reach.HydroID,
                                    # "Len2": reach.Len2,
                                    # "MaxEl": reach.MaxEl,
                                    # "Len2": reach.Len2,
                                    # "MinEl": reach.MinEl,
                                    # "OutletID": reach.OutletID,
                                    "Shape_Leng": reach.Shape_Leng,
                                    # "Slo2": reach.Slo2,
                                    # "Subbasin": reach.Subbasin,
                                    # "SubbasinR": reach.SubbasinR,
                                    # "Wid2": reach.Wid2,
                                    "basin_id": reach.basin_id,
                                    "basin_name":basinlist[str(basinid)],
                                    "temp": reach.avg_wtmpdegc,
                                    "discharge": reach.avg_flow_outcms
                                    },
                     "geometry": {"type": "LineString",
                                  "coordinates": smapping(to_shape(reach[3]))["coordinates"]
                                  },
                     } for reach in reaches]
            alldata.extend(data)
        json = jsonify({"type": "FeatureCollection", "features": alldata})
        return json




class ReachDataZip(Resource):
    """
    Return zip of reaches temp&flow information: 1.shapefiles 2. Statistics 3. raw data
    @url: /reachdatazip
    @method: GET
    @return: zip of temp&flow information: 1.shapefiles 2. Statistics 3. raw data
    @return-type: zip
    @raise keyError: raises an exception
    """
    parser.add_argument('timerangetype', type=int)
    parser.add_argument('basinids', type=str)
    parser.add_argument('isobserved', type=str)
    parser.add_argument('isRCP45', type=str)
    parser.add_argument('isRCP85', type=str)
    parser.add_argument('rcp45', type=str)
    parser.add_argument('rcp85', type=str)
    parser.add_argument('israwdata', type=inputs.boolean)
    parser.add_argument('isstastics', type=inputs.boolean)
    parser.add_argument('isavg', type=inputs.boolean)
    parser.add_argument('ismax', type=inputs.boolean)
    parser.add_argument('ismin', type=inputs.boolean)
    parser.add_argument('isSD', type=inputs.boolean)
    parser.add_argument('isVa', type=inputs.boolean)

    def get(self):

        # basinlist = returnBasinDict()

        args = parser.parse_args()
        # time range
        yearstart = args['yearstart']
        yearend = args['yearend']
        monthstart = args['monthstart']
        monthend = args['monthend']
        timerangetype = 'subset' if args['timerangetype'] == 1 else 'full'  ## subset:1, full:2

        # basin range
        basinstr = args['basinids']
        basinids = basinstr.split('_')

        # model range
        isobserved = True if args['isobserved'] == 'on' else False
        isRCP45 = True if args['isRCP45'] == 'on' else False
        isRCP85 = True if args['isRCP85'] == 'on' else False
        model_RCP45_ids = str(args['rcp45']).split('_')
        model_RCP85_ids = str(args['rcp85']).split('_')

        # stastics
        if args['israwdata']:
            israwdata = True
        else:
            israwdata = False
        isstastics = True if args['isstastics']  else False
        isavg = True if args['isavg']  else False
        ismax = True if args['ismax']  else False
        ismin = True if args['ismin']  else False
        isSD = True if args['isSD']  else False
        isVa = True if args['isVa']  else False

        ###STARTS QUERYING AND WRITE ZIP FILES HERE
        ###Create Zip Files, starts IO
        memory_file = BytesIO()

        ### 1. Each Basin
        for basinid in basinids:
            print(basinlist[str(basinid)])
            basinname = str(basinlist[basinid])

            with zipfile.ZipFile(memory_file, 'a') as zf:
                ### 1. ShapeFiles: locate shape file path and add them to archive by .
                shapefileSourcePath = os.path.join(config.SHAPEFILES_PATH, basinname, "Shape.zip").replace("\\", "/");
                arcnamePath = os.path.join('results', basinname, "Shape.zip").replace("\\", "/")
                zf.write(shapefileSourcePath, arcnamePath, zipfile.ZIP_DEFLATED)

            ### (A).if query have observered data
            if isobserved:
                ### (a)if return raw data
                if israwdata:
                    model_t_id = 0
                    observed_raw_csv = fetchRawData(yearstart, yearend, monthend, monthend, timerangetype, basinid,
                                                    model_t_id)
                    # recordeds = session.query(ReachData, RecordDateData).join(RecordDateData,
                    #                                                          ReachData.record_month_year_id == RecordDateData.id). \
                    #     recoreds = session.query(functions.ST_Transform(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID,
                    #                              Reach.Shape_Leng,
                    #                              ReachData, RecordDateData).join(ReachData,
                    #                                                              Reach.id == ReachData.rch).join(
                    #     RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
                    #     filter(RecordDateData.year >= yearstart). \
                    #     filter(RecordDateData.year <= yearend). \
                    #     filter(RecordDateData.month >= monthstart). \
                    #     filter(RecordDateData.month <= monthend). \
                    #     filter(ReachData.basin_id == basinid). \
                    #     filter(ReachData.model_id == 0).all()
                    # observed_raw_csv = 'wtmpdegc,flow_outcms, reachid,geom,ARCID,GRID_CODE,FROM_NODE,TO_NODE,AreaC,Len2,Slo2,Wid2,Dep2,MinEl,MaxEl,Shape_Leng,HydroID,OutletID \n'
                    # for record in recordeds:
                    #     recstring = str(record.wtmpdegc) + ',' + str(record.flow_outcms) + ',' + str(
                    #         record.reachid) + ',' + str(record.geom) + '\n'
                    #     observed_raw_csv += recstring
                    #### add observed raw data to ZIP files
                    with zipfile.ZipFile(memory_file, 'a') as zf:
                        raw_obs_file_path = os.path.join('results', basinname,
                                                         # file path and name EXAMPLE: ../[basinname]/Raw_observed_[basinname]_subset_1950_1955_02_03.csv
                                                         "Raw_Observerd_" + basinname + "_" + timerangetype + '_' + str(
                                                             yearstart) + "_" + str(
                                                             yearend) + "_" + str(monthstart) + "_" + str(
                                                             monthend) + ".csv").replace("\\", "/")
                        data = zipfile.ZipInfo(raw_obs_file_path)
                        data.date_time = time.localtime(time.time())[:6]
                        data.compress_type = zipfile.ZIP_DEFLATED
                        zf.writestr(data, observed_raw_csv)
                ##memory_file, csv, subpath, basinname, f_prefix, timerangetype, yearstart, yearend, monthstart, monthend
                ### (b).if return stastics data
                if isstastics:
                    stastics_csv = fetchStasticsData(yearstart, yearend, monthstart, monthend, timerangetype,basinid, 0, isavg, ismax,
                                                     ismin, isSD, isVa)
                    # file path and name EXAMPLE: ../[basinname]/Raw_stastics_[basinname]_subset_1950_1955_02_03.csv
                    addToZipFiles(memory_file, stastics_csv, '', basinname, 'Stastics_Observed_', timerangetype,
                                  yearstart, yearend,
                                  monthstart, monthend)
            ### (B). if query have RCP 45 models data
            if isRCP45:
                ### (a)if return raw data
                if israwdata:
                    for model_id in model_RCP45_ids:
                        model_name = rcp45list[str(model_id)]
                        model_raw_csv = fetchRawData(yearstart, yearend, monthend, monthend, timerangetype, basinid, model_id)
                        # file path and name EXAMPLE: ../[basinname]/RCP45/1_access1-0-rcp85/raw_1_access1-0-rcp85_[basinname]_subset_1950_1955_02_03.csv
                        addToZipFiles(memory_file, model_raw_csv, 'RCP45/' + model_name, basinname, 'Raw_' + model_name,
                                      timerangetype, yearstart,
                                      yearend, monthstart, monthend)
                ### (b).if return stastics data
                if isstastics:
                    for model_id in model_RCP45_ids:
                        model_name = rcp45list[str(model_id)]
                        model_statsics_csv = fetchStasticsData(yearstart, yearend, monthend, monthend, timerangetype, basinid,
                                                               model_id, isavg, ismax, ismin, isSD, isVa)
                        # file path and name EXAMPLE: ../[basinname]/RCP45/1_access1-0-rcp45/stastics_1_access1-0-rcp45_[basinname]_subset_1950_1955_02_03.csv
                        addToZipFiles(memory_file, model_statsics_csv, 'RCP45/' + model_name, basinname,
                                      'Stastics_' + model_name,
                                      timerangetype, yearstart,
                                      yearend, monthstart, monthend)
            if isRCP85:
                ### (a)if return raw data
                if israwdata:
                    for model_id in model_RCP85_ids:
                        model_name = rcp85list[str(model_id)]
                        model_raw_csv = fetchRawData(yearstart, yearend, monthend, monthend, timerangetype, basinid, model_id)
                        # file path and name EXAMPLE: ../[basinname]/RCP85/1_access1-0-rcp85/raw_1_access1-0-rcp85_[basinname]_subset_1950_1955_02_03.csv
                        addToZipFiles(memory_file, model_raw_csv, 'RCP85/' + model_name, basinname, 'Raw_' + model_name,
                                      timerangetype, yearstart,
                                      yearend, monthstart, monthend)
                ### (b).if return stastics data
                if isstastics:
                    for model_id in model_RCP85_ids:
                        model_name = rcp85list[str(model_id)]
                        model_statsics_csv = fetchStasticsData(yearstart, yearend, monthend, monthend, timerangetype, basinid,
                                                               model_id, isavg, ismax, ismin, isSD, isVa)
                        # file path and name EXAMPLE: ../[basinname]/RCP85/1_access1-0-rcp85/stastics_1_access1-0-rcp85_[basinname]_subset_1950_1955_02_03.csv
                        addToZipFiles(memory_file, model_statsics_csv, 'RCP85/' + model_name, basinname,
                                      'Stastics_' + model_name,
                                      timerangetype, yearstart,
                                      yearend, monthstart, monthend)

        # #     subquery 1: inner join RecordDate and ReachData by reach id; filter data by time, model, basin etc.
        # subq1 = (session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id).filter(RecordDateData.year >=yearstart).\
        #     filter(RecordDateData.year <=yearend).\
        #     filter(RecordDateData.month >= monthstart).\
        #     filter(RecordDateData.month <= monthend).\
        #     filter(ReachData.basin_id == basinid).\
        #     filter(ReachData.model_id.in_(model_ids))).subquery()
        # #    subquery 2: get all statisc value of temp and flow
        # subq = (session.query(
        #         subq1.c.rch, func.max(subq1.c.flow_outcms).label("max_flow_outcms"),
        #                             func.min(subq1.c.flow_outcms).label("min_flow_outcms"),
        #                             func.avg(subq1.c.flow_outcms).label("avg_flow_outcms"),
        #                             func.stddev(subq1.c.flow_outcms).label("std_flow_outcms"),
        #                             func.variance(subq1.c.flow_outcms).label("var_flow_outcms"),
        #                             func.max(subq1.c.wtmpdegc).label("max_wtmpdegc"),
        #                             func.min(subq1.c.wtmpdegc).label("min_wtmpdegc"),
        #                             func.avg(subq1.c.wtmpdegc).label("avg_wtmpdegc"),
        #                             func.stddev(subq1.c.wtmpdegc).label("std_wtmpdegc"),
        #                             func.variance(subq1.c.wtmpdegc).label("var_wtmpdegc"))
        #     .group_by(subq1.c.rch)).subquery()
        # #   main query: inner join subquery 2 and reach by reach id; filter by basin id
        # qry = session.query( subq.c.avg_wtmpdegc, subq.c.max_wtmpdegc, subq.c.min_wtmpdegc, subq.c.std_wtmpdegc, subq.c.var_wtmpdegc, subq.c.avg_flow_outcms,subq.c.max_flow_outcms,subq.c.min_flow_outcms,subq.c.std_flow_outcms,subq.c.var_flow_outcms, Reach.OBJECTID.label("reachid"),functions.ST_AsText(Reach.geom),Reach.ARCID,Reach.GRID_CODE, Reach.FROM_NODE, Reach.TO_NODE, Reach.AreaC, Reach.Len2, Reach.Slo2, Reach.Wid2, Reach.Dep2 ,Reach.MinEl, Reach.MaxEl, Reach.Shape_Leng, Reach.HydroID, Reach.OutletID).join(subq, Reach.OBJECTID == subq.c.rch).filter(Reach.basin_id == basinid).all()
        # #qry = (session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id))
        #
        # csv = 'avg_wtmpdegc,max_wtmpdegc,min_wtmpdegc,std_wtmpdegc,var_wtmpdegc,avg_flow_outcms,max_flow_outcms,min_flow_outcms,std_flow_outcms,var_flow_outcms, reachid,geom,ARCID,GRID_CODE,FROM_NODE,TO_NODE,AreaC,Len2,Slo2,Wid2,Dep2,MinEl,MaxEl,Shape_Leng,HydroID,OutletID \n'
        # for record in qry:
        #     recstring = str(record.avg_wtmpdegc) + ',' + str(record.max_wtmpdegc) + ',' + str(
        #         record.min_wtmpdegc) + ',' + str(record.std_wtmpdegc) + ',' + str(
        #         record.var_wtmpdegc) + ',' + str(record.avg_flow_outcms) + ',' + str(record.reachid) + ',' + '\n'
        #     csv += recstring
        #
        # ## Create Zip Files
        # memory_file = BytesIO()
        # basinname =  basinlist[basinid]
        # with zipfile.ZipFile(memory_file, 'w') as zf:
        #     ### ShapeFiles: locate shape file path and add them to archive by .
        #     shapefileSourcePath = os.path.join(config.SHAPEFILES_PATH, basinname, "Shape.zip").replace("\\","/");
        #     arcnamePath = os.path.join(basinname, "Shape.zip").replace("\\","/")
        #     zf.write(shapefileSourcePath, arcnamePath, zipfile.ZIP_DEFLATED)
        #
        #     ### Statistics File
        #     statsFilePath = os.path.join(basinname, "Statistics_Observerd_" + basinname + "_" + str(yearstart) +"_" + str(yearstart) + "_" + str(monthstart) + "_" + str(monthend) + ".csv" ).replace("\\","/")
        #     data = zipfile.ZipInfo(statsFilePath)
        #     data.date_time = time.localtime(time.time())[:6]
        #     data.compress_type = zipfile.ZIP_DEFLATED
        #     zf.writestr(data, csv)
        #
        #     ### RawData File

        memory_file.seek(0)
        return Response(
            memory_file,
            mimetype="application/zip",
            headers={"Content-disposition":
                         "attachment; filename=zipfile.zip"})


def fetchRawData(yearstart, yearend, monthstart, monthend, timerangerype, basinid, model_t_id):
    # recordeds = session.query(ReachData, RecordDateData).join(RecordDateData,
    #                                                         ReachData.record_month_year_id == RecordDateData.id). \

    if timerangerype == "subset":
        recoreds = session.query(functions.ST_AsText(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID,
                                 Reach.Shape_Leng, Reach.AreaC, Reach.GRID_CODE, Reach.FROM_NODE, Reach.TO_NODE,
                                 Reach.Len2, Reach.Slo2, Reach.Wid2, Reach.Dep2, Reach.MinEl,
                                 Reach.MaxEl, Reach.HydroID, Reach.OutletID,
                                 ReachData, Reach).\
            join(ReachData,Reach.OBJECTID == ReachData.rch).join(
            RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
            filter(Reach.basin_id == basinid).\
        filter(RecordDateData.year >= yearstart). \
            filter(RecordDateData.year <= yearend). \
            filter(RecordDateData.month >= monthstart). \
            filter(RecordDateData.month <= monthend). \
            filter(ReachData.basin_id == basinid). \
            filter(ReachData.model_id == model_t_id).all()
    else:
        recoreds = session.query(functions.ST_AsText(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID,
                                 Reach.Shape_Leng, Reach.AreaC, Reach.GRID_CODE, Reach.FROM_NODE, Reach.TO_NODE,
                                 Reach.Len2, Reach.Slo2, Reach.Wid2, Reach.Dep2, Reach.MinEl,
                                 Reach.MaxEl, Reach.HydroID, Reach.OutletID,
                                 ReachData, RecordDateData).join(ReachData,
                                                                 Reach.id == ReachData.rch).join(
            RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
            filter(((RecordDateData.year == yearstart) & (RecordDateData.month >= monthstart)).self_group() | (
                (RecordDateData.year == yearend) & (RecordDateData.month <= monthend)).self_group() | (
                           (RecordDateData.year > yearstart) & (RecordDateData.year < yearend)).self_group()). \
            filter(ReachData.basin_id == basinid). \
            filter(ReachData.model_id == model_t_id).all()
    observed_raw_csv = 'wtmpdegc,flow_outcms, reachid,geom,ARCID,GRID_CODE,FROM_NODE,TO_NODE,AreaC,Len2,Slo2,Wid2,Dep2,MinEl,MaxEl,Shape_Leng,HydroID,OutletID \n'
    for record in recoreds:
        recstring = str(record.ReachData.wtmpdegc) + ',' + str(record.ReachData.flow_outcms) + ',' + str(
            record.ReachData.rch) + ',' + str(record[0]) + ',' +str(record.ARCID) + ',' +str(record.GRID_CODE)+ ',' + str(
            record.AreaC)+ ',' + str(record.FROM_NODE)+ ',' + str(record.TO_NODE)+ ',' + str(record.AreaC)+ ',' + str(record.Len2)+ ',' + str(
            record.Slo2) + ',' + \
                    str(record.Wid2)+ ',' + str(record.Dep2)+ ',' + str(record.MinEl)+ ',' + str(record.MaxEl)+ ',' + str(
            record.Shape_Leng)+ ',' + str(record.HydroID)+ ',' + str(record.OutletID) + '\n'
        observed_raw_csv += recstring
    return observed_raw_csv


def addToZipFiles(memory_file, csv, subpath, basinname, f_prefix, timerangetype, yearstart, yearend, monthstart,
                  monthend):
    with zipfile.ZipFile(memory_file, 'a') as zf:
        raw_obs_file_path = os.path.join('results', basinname, subpath,
                                         f_prefix + "_" + basinname + "_" + timerangetype + '_' + str(
                                             yearstart) + "_" + str(
                                             yearend) + "_" + str(monthstart) + "_" + str(
                                             monthend) + ".csv").replace("\\", "/")
        data = zipfile.ZipInfo(raw_obs_file_path)
        data.date_time = time.localtime(time.time())[:6]
        data.compress_type = zipfile.ZIP_DEFLATED
        zf.writestr(data, csv)


def fetchStasticsData(yearstart, yearend, monthstart, monthend, timerangetype, basinid, model_id, isAVG, isMAX, isMIN, isSD, isVar):
    #     subquery 1: inner join RecordDate and ReachData by reach id; filter data by time, model, basin etc.
    if timerangetype == 'subset':
        subq1 = (
            session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id).filter(
                RecordDateData.year >= yearstart). \
                filter(RecordDateData.year <= yearend). \
                filter(RecordDateData.month >= monthstart). \
                filter(RecordDateData.month <= monthend). \
                filter(ReachData.basin_id == basinid). \
                filter(ReachData.model_id == model_id)).subquery()
    else:
        subq1 = (
            session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
                filter(((RecordDateData.year == yearstart) & (RecordDateData.month >= monthstart)).self_group() | (
                        (RecordDateData.year == yearend) & (RecordDateData.month <= monthend)).self_group() | (
                                   (RecordDateData.year > yearstart) & (RecordDateData.year < yearend)).self_group()). \
                filter(ReachData.basin_id == basinid). \
                filter(ReachData.model_id == model_id)).subquery()
    #    subquery 2: get all statisc value of temp and flow
    subq = (session.query(
        subq1.c.rch, func.max(subq1.c.flow_outcms).label("max_flow_outcms"),
        func.min(subq1.c.flow_outcms).label("min_flow_outcms"),
        func.avg(subq1.c.flow_outcms).label("avg_flow_outcms"),
        func.stddev(subq1.c.flow_outcms).label("std_flow_outcms"),
        func.variance(subq1.c.flow_outcms).label("var_flow_outcms"),
        func.max(subq1.c.wtmpdegc).label("max_wtmpdegc"),
        func.min(subq1.c.wtmpdegc).label("min_wtmpdegc"),
        func.avg(subq1.c.wtmpdegc).label("avg_wtmpdegc"),
        func.stddev(subq1.c.wtmpdegc).label("std_wtmpdegc"),
        func.variance(subq1.c.wtmpdegc).label("var_wtmpdegc"))
            .group_by(subq1.c.rch)).subquery()
    #   main query: inner join subquery 2 and reach by reach id; filter by basin id
    qry = session.query(subq.c.avg_wtmpdegc, subq.c.max_wtmpdegc, subq.c.min_wtmpdegc, subq.c.std_wtmpdegc,
                        subq.c.var_wtmpdegc, subq.c.avg_flow_outcms, subq.c.max_flow_outcms, subq.c.min_flow_outcms,
                        subq.c.std_flow_outcms, subq.c.var_flow_outcms, Reach.OBJECTID.label("reachid"),
                        functions.ST_AsText(Reach.geom), Reach.ARCID.label("ARCID"), Reach.GRID_CODE, Reach.FROM_NODE,
                        Reach.TO_NODE, Reach.AreaC, Reach.Len2, Reach.Slo2, Reach.Wid2, Reach.Dep2, Reach.MinEl,
                        Reach.MaxEl, Reach.Shape_Leng, Reach.HydroID, Reach.OutletID).join(subq,
                                                                                           Reach.OBJECTID == subq.c.rch).filter(
        Reach.basin_id == basinid).all()
    # qry = (session.query(ReachData).join(RecordDateData, ReachData.record_month_year_id == RecordDateData.id))

    csv = ('avg_wtmpdegc, avg_flow_outcms,') if isAVG else ''
    csv += ('max_wtmpdegc,max_flow_outcms,') if isMAX else ''
    csv += ('min_wtmpdegc,min_flow_outcms,') if isMIN else ''
    csv += ('std_wtmpdegc,std_flow_outcms') if isSD else ''
    csv += ('var_wtmpdegc,var_flow_outcms,') if isVar else ''
    csv += 'reachid,geom,ARCID,GRID_CODE,FROM_NODE,TO_NODE,AreaC,Len2,Slo2,Wid2,Dep2,MinEl,MaxEl,Shape_Leng,HydroID,OutletID \n'
    for record in qry:
        recstring = (str(record.avg_wtmpdegc) + ',' + str(record.avg_flow_outcms) + ',') if isAVG else ''
        recstring += (str(record.max_wtmpdegc) + ',' + str(record.max_flow_outcms) + ',') if isMAX else ''
        recstring += (str(record.min_wtmpdegc) + ',' + str(record.min_flow_outcms) + ',') if isMIN else ''
        recstring += (str(record.std_wtmpdegc) + ',' + str(record.std_flow_outcms) + ',') if isSD else ''
        recstring += (str(record.var_wtmpdegc) + ',' + str(record.var_flow_outcms) + ',') if isVar else ''
        recstring += str(record.reachid)+ ',' + str(record[11])+ ',' + str(record.ARCID)+ ',' + str(record.GRID_CODE)+ ',' + str(
            record.AreaC)+ ',' + str(record.FROM_NODE)+ ',' + str(record.TO_NODE)+ ',' + str(record.AreaC)+ ',' + str(record.Len2)+ ',' + str(
            record.Slo2)+ ',' + \
                     str(record.Wid2)+ ',' + str(record.Dep2) + ',' + str(record.MinEl)+ ',' + str(record.MaxEl)+ ',' + str(
            record.Shape_Leng)+ ',' + str(record.HydroID) + ',' + str(record.OutletID) + '\n'
        csv += recstring

    return csv

class ReachDataResource(Resource):
    """
    Return csv of reaches temp&flow information
    @url: /reachdata
    @method: GET
    @return: csv of temp&flow information
    @return-type: csv
    @raise keyError: raises an exception
    """
    parser.add_argument('timerangetype', type=int)
    parser.add_argument('model_id', type=int)
    parser.add_argument('isobserved', type=str)
    parser.add_argument('isRCP45', type=str)
    parser.add_argument('isRCP85', type=str)
    parser.add_argument('rcp45', type=str)
    parser.add_argument('rcp85', type=str)

    def get(self):
        args = parser.parse_args()
        basinid = args['basin_id']
        yearstart = args['yearstart']
        yearend = args['yearend']
        monthstart = args['monthstart']
        monthend = args['monthend']
        timerangetype = args['timerangetype']
        model_id = 0 if args['model_id'] == 0 else args['model_id']
        isobserved = True if args['isobserved'] == 'off' else False
        # israw = args['israw'] # if no, output statics result
        # recoreds = session.query(ReachData,RecordDateData).join( RecordDateData,ReachData.record_month_year_id == RecordDateData.id).\
        recoreds = session.query(functions.ST_Transform(Reach.geom, 4326), Reach.OBJECTID, Reach.ARCID,
                                 Reach.Shape_Leng,
                                 ReachData, RecordDateData).join(ReachData, Reach.id == ReachData.rch).join(
            RecordDateData, ReachData.record_month_year_id == RecordDateData.id). \
            filter(RecordDateData.year >= yearstart). \
            filter(RecordDateData.year <= yearend). \
            filter(RecordDateData.month >= monthstart). \
            filter(RecordDateData.month <= monthend). \
            filter(ReachData.basin_id == basinid). \
            filter(ReachData.model_id == model_id).all()
        # filter(ReachData.is_observed == isobserved).all()

        csv = 'Id,rch,flow_outcms,wtmpdegc,year,month\n'
        for record in recoreds:
            recstring = str(record.ReachData.Id) + ',' + str(record.ReachData.rch) + ',' + str(
                record.ReachData.flow_outcms) + ',' + str(record.ReachData.wtmpdegc) + ',' + str(
                record.RecordDateData.year) + ',' + str(record.RecordDateData.month) + '\n'
            csv += recstring
        return Response(
            csv,
            mimetype="text/csv",
            headers={"Content-disposition":
                         "attachment; filename=myplot.csv"})