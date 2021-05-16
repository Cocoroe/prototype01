import asyncio

# from flask import Flask, jsonify
from dotenv import load_dotenv, dotenv_values
from quart import Quart, jsonify
from quart_cors import cors
from services.bithumb import BithumbService

config = dotenv_values(".env")
print("✔️ main")

if __name__ == "__main__":
    bithumbService = BithumbService()
    # bithumbService.subscribe_update()
    """app"""
    app = Quart("pandasFlask")
    app = cors(app, allow_origin="*")

    """router"""

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

    loop = asyncio.get_event_loop()
    loop.run_until_complete(
        asyncio.gather(
            app.run_task(debug=True, host=config["HOST"], port=int(config["PORT"])),
            bithumbService.subscribe_update(),
        )
    )
    loop.close()
