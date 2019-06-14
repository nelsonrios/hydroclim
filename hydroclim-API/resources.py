from models import Basin_info
from db import session

from flask_restplus import reqparse
from flask_restplus import abort
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import marshal_with

basin_info_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String
}

parser = reqparse.RequestParser()
parser.add_argument('basininfo', type=str)

class BasininfoResource(Resource):
    @marshal_with(basin_info_fields)
    def get(self, id):
        basinfo = session.query(Basin_info).filter(Basin_info.id == id).first()
        if not basinfo:
            abort(404, message="Basin_Info {} doesn't exist".format(id))
        return basinfo

    def delete(self, id):
        basinfo = session.query(Basin_info).filter(Basin_info.id == id).first()
        if not basinfo:
            abort(404, message="Basin_Info {} doesn't exist".format(id))
        session.delete(basinfo)
        session.commit()
        return {}, 204



class BasinListResource(Resource):
    @marshal_with(basin_info_fields)
    def get(self):
        basinlists = session.query(Basin_info).all()
        return basinlists
