import json
from dotenv import load_dotenv, dotenv_values
import redis
from flask import Flask, jsonify
import pybithumb
import pandas as pd
import numpy as np

print("✔️ BithumbService")

CACHE_TIME_DAY_1 = 60 * 60 * 24
CACHE_TIME_MIN_30 = 60 * 30

CACHE_get_tickers = "CACHE_get_tickers"
CACHE_get_tickers_TIME = CACHE_TIME_MIN_30
CACHE_get_candlestick = "CACHE_get_candlestick"
CACHE_get_candlestick_TIME = CACHE_TIME_DAY_1


class BithumbService(object):
    def __init__(self):
        self.update = "now"
        self.config = dotenv_values(".env")
        config = self.config
        self.cache = redis.Redis(
            host=config["REDIS_HOST"],
            port=int(config["REDIS_PORT"]),
            password=config["REDIS_PASSWORD"],
            db=0,
        )

    def get_updated(self):
        return self.update

    def get_tickers(self):
        """caching json object"""
        cache = self.cache
        d = cache.get(CACHE_get_tickers)
        if d:
            return jsonify(json.loads(d))
        else:
            tickers = pybithumb.get_tickers()
            cache.setex(CACHE_get_tickers, CACHE_get_tickers_TIME, json.dumps(tickers))
        return jsonify(tickers)

    def get_ohlcv(self, ticker):
        cache = self.cache
        if not ticker:
            ticker = "BTC"
        d = cache.get(CACHE_get_candlestick)
        if d:
            return d  # jsonify(json.loads(d))
        else:
            df = pybithumb.get_candlestick(ticker, chart_intervals="24h")
            df = df.reset_index()
            data = df.to_json()  # no need to conver json dumps
            cache.setex(CACHE_get_candlestick, CACHE_get_candlestick_TIME, data)
            return data
