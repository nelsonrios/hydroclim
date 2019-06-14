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


basin.add_resource(BasininfoResource,'/basininfo/<string:id>', endpoint = 'basininfo')
basin.add_resource(BasinListResource,'/basinlist', endpoint = 'basinlists')
api.add_namespace(basin)


if __name__ == '__main__':
    app.run()
