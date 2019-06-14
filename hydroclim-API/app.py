from flask import Flask
from flask_restplus import Resource, Namespace, Api

app = Flask(__name__)
api = Api(app, prefix="/v1", title="Hydroclim", description="Hydroclim  api.")

@api.route('/users')
class UserApi(Resource):
    def get(self):
        return {'user': '1'}

from resources import BasininfoResource
from resources import BasinListResource

basin = Namespace("basin")


basin.add_resource(BasininfoResource,'/basininfo', endpoint = 'basin_info')
basin.add_resource(BasinListResource,'/basinlist', endpoint = 'basin_list')
api.add_namespace(basin)


if __name__ == '__main__':
    app.run()
