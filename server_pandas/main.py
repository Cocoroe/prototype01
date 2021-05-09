import pybithumb
import pandas as pd 
import numpy as np 
import redis
from flask import Flask,jsonify
from dotenv import load_dotenv,dotenv_values

# load_dotenv()  # take environment variables from .env.
config = dotenv_values(".env")

# connection redis cache
r = redis.Redis(host=config['REDIS_HOST'], port=int(config['REDIS_PORT']),password=config['REDIS_PASSWORD'],db=0)
# print(r.get('dododo'))

# python data processor server
# ref : https://frhyme.github.io/python-lib/flask_pandas/
app = Flask("pandasFlask")

@app.route("/")
def home():
  return "home"

@app.route("/ticker")
def get_tickers():
  tickers = pybithumb.get_tickers()
  print(tickers)
  return jsonify(tickers)

@app.route("/ohlcv")
def get():
  df = pybithumb.get_candlestick("BTC", chart_intervals="30m")
  df = df.reset_index()
  return df.to_json()
# @app.route('/pandas')
# def make_read_excel():
#     ## 반드시 static에 있지 않아도 읽을 수는 있음.
#     ## 현재 파일과 읽으려는 파일이 같은 경로에 있기 때문에 아래와 같은 방식으로 읽을 수도 있음.


#     ## make excel file 
#     writer = pd.ExcelWriter('static/excel_for_flask.xlsx')
#     df = pd.DataFrame({"col_{}".format(i):list(np.random.randint(0, 100, 100)) for i in range(0, 8)})
#     df.to_excel(writer, 'sheet1')
#     writer.save()

#     ## read excel file 
#     df = pd.read_excel('static/excel_for_flask.xlsx')
#     ## 아주 다행히도, dataframe을 html 문서로 바로 변환해주는 형식이 있습니다. 
#     return df.to_html()


app.run(debug=True, threaded=True,host="0.0.0.0",port=4100)