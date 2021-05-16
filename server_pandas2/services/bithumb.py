import json
import pybithumb
import pandas as pd
import numpy as np
import datetime
import time
import asyncio
import requests

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

CACHE_get_current_price = "CACHE_get_current_price"
CACHE_get_current_price_TIME = 1


class BithumbService(object):
    def __init__(self, cache, config):  # ✅
        try:
            self.updatedat = datetime.datetime.now()
            self.config = config
            self.cache = cache
        except:
            print("Error config is not sufficient")

    # [ getter-checker-*updater ]
    # 가격 데이터 연산 부분
    # 개별 종목 가격데이터 수집
    # *이평선 데이터 추가
    # *변동성 데이터 추가
    # *모멘텀 데이터 추가
    async def __subscribe_updater(self, ticker):  # ✅
        tickers = self.get_tickers()
        if ticker not in tickers:
            return None
        df_BULL_5 = pybithumb.get_candlestick(ticker, chart_intervals="24h")
        df_BULL_5["SMA_5"] = df_BULL_5["close"].rolling(5).mean()
        df_BULL_5["BULL_5"] = df_BULL_5["SMA_5"] / df_BULL_5["close"]
        df_BULL_5 = df_BULL_5.reset_index()
        return df_BULL_5

    # [ getter-*checker-updater ]
    # 코인 종목들의 가격 데이터를 업데이트 합니다.
    async def subscribe_checker(self):
        print("subscribe_update")
        cache = self.cache
        while True:  # 5초 주기로 ticker들의 데이터를 업데이트 확인 합니다.
            print("✔️ check coin update")
            await asyncio.sleep(10)
            tickers = self.get_tickers()

            for ticker in tickers:  # 캐쉬된 데이터가 없다면 2초마다 ticker를 순회하며 데이터를 저장
                cache_key = f"{CACHE_get_BULL_5}_{ticker}"
                d = cache.get(cache_key)
                if d:
                    pass
                else:
                    print(f"✔️ update... {ticker}", end="")
                    data = await self.__subscribe_updater(ticker)
                    cache.setex(cache_key, CACHE_get_BULL_5_TIME, data.to_json())
                    await asyncio.sleep(0.1)
                    print(f" done ✔️")

    # [ *getter-checker-updater ]
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
            # upbit를 통해서 교차 검증
            tickers = list(
                filter(
                    lambda x: requests.get(
                        f"https://static.upbit.com/logos/{x}.png"
                    ).status_code
                    == 200,
                    tickers,
                )
            )
            print("tickers list : ", tickers)  # tickers list
            print("tickers len : ", len(tickers))  # 97 장 형성
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

    def get_current_price(self):
        """
        현재 가격 데이터 df_all를 가져와서,
        bull_5 데이터를 df_all에 추가한다.
        (단, bull_5 데이터가 캐쉬에 있을 경우만 )
        """
        cache = self.cache
        d = cache.get(CACHE_get_current_price)
        if d:
            return d
        else:
            tickers_filtered = self.get_tickers()
            res = pybithumb.get_current_price("all")
            df_all = pd.DataFrame(res["data"]).T
            df_all = df_all.drop("date")
            df_all = df_all.drop(list(set(df_all.index) - set(tickers_filtered)))
            self.decorate_technical_data(df_all)
            df_all = df_all.T
            cache.setex(
                CACHE_get_current_price, CACHE_get_current_price_TIME, df_all.to_json()
            )
            print(df_all)
            return df_all.to_json()

    """ decorator? middle ware? data pipe line ?  """

    def decorate_technical_data(self, df_all):  # 비순수 함수
        tickers = self.get_tickers()
        print(f"tickers len : {len(tickers)}")
        for ticker in tickers:
            try:
                df_BULL_5_json = self.cache.get(f"{CACHE_get_BULL_5}_{ticker}")
                df_BULL_5 = pd.read_json(df_BULL_5_json)
                # df_all.loc[ticker, "BULL_5"] = df_BULL_5.iloc[-1]["BULL_5"]
                if df_all.loc[ticker, "closing_price"] == np.nan:
                    print("closing_price is not exits")
                    raise Exception()
                if df_BULL_5.iloc[-2]["SMA_5"] == np.nan:
                    print("SMA_5 is not exits")
                    raise Exception()

                df_all.loc[ticker, "BULL_5"] = (
                    float(df_all.loc[ticker, "closing_price"])
                    / df_BULL_5.iloc[-2]["SMA_5"]
                )
            except:
                print(f"error : decorate_technical_data : {ticker}")
                return
