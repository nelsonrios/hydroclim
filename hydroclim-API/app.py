from flask import Flask
from flask_restplus import Resource, Namespace, Api
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api = Api(app, prefix="/v1", title="Hydroclim", description="Hydroclim  api.")

@api.route('/users')
class UserApi(Resource):
    def get(self):
        return {'user': '1'}

#Basin NameSpace

from resources import BasininfoResource
from resources import BasinListResource
from resources import BasinResource
from resources import ReachResource
from resources import ReachDataResource
from resources import getReachData
from resources import ReachDataZip
from resources import getAllReachData
from resources import UserInfo
from resources import userLogin

basin = Namespace("basin")

reach = Namespace("reach")

records = Namespace("records")
#Basin NameSpace
basin.add_resource(BasininfoResource,'/basininfo/<string:id>', endpoint = 'basininfo')
basin.add_resource(BasinListResource,'/basinlist', endpoint = 'basinlists')
basin.add_resource(BasinResource, "/basin", endpoint = 'basins')
api.add_namespace(basin)

#Reach NameSpace
reach.add_resource(ReachResource, "/reach", endpoint = 'reaches')
#reach.add_resource(ReachDataResource, "/reachdata", endpoint = 'records')

#reach.add_resource(ReachGeoResource, "/reachbyloc/<int:x>/<int:y>", endpoint = 'reaches')
api.add_namespace(reach)

#Records NameSpace
records.add_resource(ReachDataResource, "/reachdata", endpoint = 'records')
records.add_resource(getReachData, "/getreachdata", endpoint = 'reachrecord')
records.add_resource(getAllReachData, "/getallreachdata", endpoint = 'allreachrecord')
records.add_resource(ReachDataZip, "/reachdatazip", endpoint = 'reachrecordzip')
api.add_namespace(records)

#Model NameSpace


#User NameSpace
user = Namespace("user")
user.add_resource(UserInfo, "/user", endpoint = 'userinfolist')
user.add_resource(userLogin, "/login", endpoint = 'userlogin')
api.add_namespace(user)


if __name__ == '__main__':
    app.run(debug=True)
