from flask import Flask
from dotenv import load_dotenv, dotenv_values
from services.bithumb import BithumbService

config = dotenv_values(".env")

print("✔️ main")
# python data processor server
# ref : https://frhyme.github.io/python-lib/flask_pandas/


if __name__ == "__main__":
    """settings"""
    bithumbService = BithumbService()
    bithumbService.subscribe_update()

    """app"""
    app = Flask("pandasFlask")

    """router"""

    @app.route("/")
    def home():
        return "✅ server is running"

    @app.route("/ticker")
    def get_tickers():
        """코인 종류 제공"""
        return jsonify(bithumbService.get_tickers())

    @app.route("/ohlcv/<string:ticker>")
    def get_ohlcv(ticker):
        """특정 코인의 가격 데이터"""
        return jsonify(bithumbService.get_ohlcv(ticker))

    @app.route("/nowpice")
    def get_price():
        return jsonify(bithumbService.get_nowPice())

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

    app.run(debug=True, threaded=True, host=config["HOST"], port=int(config["PORT"]))
