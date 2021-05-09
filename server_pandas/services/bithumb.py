import json
from dotenv import load_dotenv, dotenv_values
import redis
from flask import Flask, jsonify
import pybithumb
import pandas as pd
import numpy as np
import datetime
import time

print("✔️ BithumbService")

CACHE_TIME_DAY_1 = 60 * 60 * 24
CACHE_TIME_MIN_30 = 60 * 30
CACHE_TIME_SEC_10 = 10

CACHE_get_tickers = "CACHE_get_tickers"
CACHE_get_tickers_TIME = CACHE_TIME_MIN_30

CACHE_get_candlestick = "CACHE_get_candlestick"
CACHE_get_candlestick_TIME = CACHE_TIME_DAY_1

CACHE_get_BULL_5 = "CACHE_get_BULL_5"
CACHE_get_BULL_5_TIME = CACHE_TIME_DAY_1


class BithumbService(object):
    def __init__(self):
        self.updatedat = datetime.datetime.now()
        self.config = dotenv_values(".env")
        config = self.config
        self.cache = redis.Redis(
            host=config["REDIS_HOST"],
            port=int(config["REDIS_PORT"]),
            password=config["REDIS_PASSWORD"],
            db=0,
        )

    def __get_df_bull_5(self, ticker):
        tickers = self.get_tickers()
        if ticker not in tickers:
            return None

        df_BTC = pybithumb.get_candlestick(ticker, chart_intervals="24h")
        df_BTC["SMA_5"] = df_BTC["close"].rolling(5).mean()
        df_BTC["BULL_5"] = df_BTC["SMA_5"] / df_BTC["close"]
        return df_BTC

    def subscribe_update(self):
        cache = self.cache
        while True:
            print("✔️ check coin update")
            time.sleep(5)
            tickers = self.get_tickers()

            for ticker in tickers:
                cache_key = f"{CACHE_get_BULL_5}_{ticker}"
                d = cache.get(cache_key)
                if d:
                    pass
                else:
                    data = self.__get_df_bull_5(ticker)
                    cache.setex(cache_key, CACHE_get_BULL_5_TIME, data)
                    time.sleep(1)
            print(tickers)

    def get_updated(self):
        """최근 업데이트 날짜를 반환"""
        return self.updatedat

    def get_tickers(self):
        """
        사용중인 ticker리스트를 출력
        - caching json object
        """
        cache = self.cache
        d = cache.get(CACHE_get_tickers)
        if d:
            return json.loads(d)
        else:
            tickers = pybithumb.get_tickers()
            cache.setex(CACHE_get_tickers, CACHE_get_tickers_TIME, json.dumps(tickers))
        return tickers

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

    def get_nowPice(self):
        cache = self.cache
        res = pybithumb.get_current_price("all")
        df_all = pd.DataFrame(res["data"]).T
        df_all = df_all.drop("date")
        return df_all.to_json()
