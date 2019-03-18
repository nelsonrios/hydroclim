from flask import Flask
from flask import render_template
import config

app = Flask(__name__)
app.config.from_object(config)


@app.route('/')
#def hello_world():
#    return 'Hello World!'
def hydro_clim_test():
    return render_template("ma_bay.html");

if __name__ == '__main__':
    app.run()
