from models import Basin_info, Basin, Reach, ReachData, RecordDateData

from db import session
from flask import jsonify,request,Response

from flask_restplus import reqparse, abort, Resource, fields, marshal_with

#import geoalchemy2,shapely
from json import dumps
from shapely.geometry import geo
from geoalchemy2 import functions
from geoalchemy2.shape import to_shape

#==========Basin ==================
basin_info_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}
basin_fields = {
    'OBJECTID' : fields.Integer,
    'disID' : fields.Float,
    'Shape_Leng' : fields.Float,
    'Shape_Area' : fields.Float,
    'geom' : fields.String,
    'basin_info_id': fields.Integer
    #'basin_shp_id': fields.Integer
}
parser = reqparse.RequestParser()
parser.add_argument('basininfo', type=str)


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
        #basins = session.scalar(functions.ST_AsGeoJSON(Basin.geom))
        smapping = geo.mapping
        basins= session.query(Basin).all()
        data = [{"geometry":{"coordinates":smapping(to_shape(basin.geom))["coordinates"],
                           "type":"MultiPolygon"
                           },
               "type":"Feature",
               "properties":{"basin_info_id":basin.basin_info_id},
               } for basin in basins]
        return jsonify({"features":data,"type":"FeatureCollection"})

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
        #basins = session.scalar(functions.ST_AsGeoJSON(Basin.geom))
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
                reaches = session.query(functions.ST_Transform(Reach.geom, 4326),Reach.OBJECTID,Reach.ARCID,Reach.GRID_CODE,Reach.AreaC,Reach.Dep2,Reach.FROM_NODE,Reach.TO_NODE,Reach.HydroID,Reach.Len2,Reach.MaxEl,Reach.Len2,Reach.MinEl,Reach.OutletID,Reach.Shape_Leng,Reach.Slo2,Reach.Subbasin,Reach.SubbasinR,Reach.Wid2,
                                       ).filter(Reach.basin_id == basin_id).all()
                data = [{"type": "Feature",
                        "properties":{"OBJECTID":reach.OBJECTID,
                                      "ARCID":reach.ARCID,
                                      "GRID_CODE":reach.GRID_CODE,
                                      "AreaC":reach.AreaC,
                                      "Dep2":reach.Dep2,
                                      "FROM_NODE":reach.FROM_NODE,
                                      "TO_NODE":reach.TO_NODE,
                                      "HydroID":reach.HydroID,
                                      "Len2":reach.Len2,
                                      "MaxEl":reach.MaxEl,
                                      "Len2":reach.Len2,
                                      "MinEl":reach.MinEl,
                                      "OutletID":reach.OutletID,
                                      "Shape_Leng":reach.Shape_Leng,
                                      "Slo2":reach.Slo2,
                                      "Subbasin":reach.Subbasin,
                                      "SubbasinR":reach.SubbasinR,
                                      "Wid2":reach.Wid2
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
            #reaches= session.query(Reach.OBJECTID,functions.ST_Transform(Reach.geom,4326)).filter(Reach.OBJECTID == 80).all()
            reaches= session.query(Reach.OBJECTID,functions.ST_Transform(Reach.geom,4326)).all()
            data = [{"type":"Feature",
               "properties":{"OBJECTID":reach.OBJECTID},
               "geometry":{"type":"LineString",
                           "coordinates":smapping(to_shape(reach[1]))["coordinates"]
                           },
               } for reach in reaches]
            json = jsonify({"type":"FeatureCollection","features":data})
            return json

parser.add_argument('monthstart', type=int)
parser.add_argument('monthend', type=int)
parser.add_argument('yearstart', type=int)
parser.add_argument('yearend', type=int)
parser.add_argument('basin_id', type=int)
parser.add_argument('isobserved',type=bool)
parser.add_argument('israw',type=bool)
class ReachDataResource(Resource):
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
        basinid= args['basin_id']
        isobserved = True if args['isobserved'] == 'off' else False
        #israw = args['israw'] # if no, output statics result
        recoreds = session.query(ReachData,RecordDateData).join( RecordDateData,ReachData.record_month_year_id == RecordDateData.id).\
            filter(RecordDateData.year >=yearstart).\
            filter(RecordDateData.year <=yearend).\
            filter(RecordDateData.month >= monthstart).\
            filter(RecordDateData.month <= monthend).\
            filter(ReachData.basin_id == basinid).\
            filter(ReachData.is_observed == isobserved).all()

        csv = 'Id,rch,areakm2,flow_outcms,wtmpdegc,month,year\n'
        for record in recoreds:
            recstring = str(record.ReachData.Id) + ',' + str(record.ReachData.rch) + ',' + str(record.ReachData.flow_outcms) + ',' + str(record.ReachData.wtmpdegc) + ',' + str(record.RecordDateData.year) + ',' + str(record.RecordDateData.month) + '\n'
            csv += recstring
        return Response(
            csv,
            mimetype="text/csv",
            headers={"Content-disposition":
                         "attachment; filename=myplot.csv"})
