import asyncio
import redis
from dotenv import load_dotenv, dotenv_values
from quart import Quart, jsonify
from quart_cors import cors
from services.bithumb import BithumbService

config = dotenv_values(".env")
print("✔️ main")


async def main():
    cache = redis.Redis(
        host=config["REDIS_HOST"],
        port=int(config["REDIS_PORT"]),
        password=config["REDIS_PASSWORD"],
        db=0,
    )
    bithumbService = BithumbService(cache=cache, config=config)
    app = Quart("pandasFlask")
    app = cors(app, allow_origin="*")

    @app.route("/")
    async def home():
        return "✅ server is running"

    @app.route("/ticker")
    async def get_tickers():  # ✅
        """코인 종류 제공"""
        return jsonify(bithumbService.get_tickers())

    @app.route("/ohlcv/<string:ticker>")
    async def get_ohlcv(ticker):
        """특정 코인의 가격 데이터"""
        return bithumbService.get_ohlcv(ticker)

    @app.route("/get_current_price")
    async def get_current_price():
        return bithumbService.get_current_price()

    @app.route("/get_S13_coins")
    async def get_S13_coins():
        return bithumbService.get_S13_coins()

    @app.route("/get_technical_data/<string:ticker>")
    async def get_technical_data(ticker):
        return bithumbService.get_technical_data(ticker)

    coinUpdater = asyncio.create_task(bithumbService.subscribe_checker())
    await app.run_task(debug=True, host=config["HOST"], port=int(config["PORT"]))


if __name__ == "__main__":
    asyncio.run(main())
