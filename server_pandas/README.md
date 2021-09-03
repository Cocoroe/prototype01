## python flask pandas data process server

- 목적 : 코인 데이터 처리 및 serve

## install

```
1. setting virtualenv
2. pip install requirements.txt
3. make file .env
```

### 1. virtualenv

```
virtualenv env  --python=python3.8
source env/bin/activate

```

### 2. requirements.txt

```
pip install setuptools quart quart_cors
pip install redis flask pybithumb
pip install python-dotenv
```

### 3. .env

```
# Development settings example
DOMAIN=example.org
ADMIN_EMAIL=admin@${DOMAIN}
ROOT_URL=${DOMAIN}/app


# Flask Settings
PORT = 4000
HOST = 0.0.0.0

# REDIS Settings
REDIS_HOST = 192.168.0.1
REDIS_PORT =  15000
REDIS_PASSWORD = PASS_WORD

REDIS_URI = redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}/0

# REDIS CLI 
# redis-cli -h 192.168.0.1 -p 15000 -a PASS_WORD
```

## example code

- caching API ( 2sec caching )

```python
  @app.route("/test")
  def test():
    d = cache.get("sec2")
    if d:
      print('cached')
      return d
    else:
      print('caching')
      cache.setex('sec2',2,"sec2_value")
      return "sec2_value"
```

- caching list en/de code json

```python
  @app.route("/ticker")
  def get_tickers():
    """ caching json object """
    d = cache.get(CACHE_TICKER)
    if d:
      return jsonify(json.loads(d))
    else:
      tickers = pybithumb.get_tickers()
      cache.setex(CACHE_TICKER,CACHE_TICKER_TIME,json.dumps(tickers))
      return jsonify(tickers)
```

- cahing dataframe en/decode json

```python
import redis
cache = redis.Redis(
            host="xxx",
            port=int(6380),
            password="xxx",
            db=0,
        )
print(cache.get("dododo"))

df_BTC = pybithumb.get_candlestick("BTC", chart_intervals="24h")
df_BTC['SMA_5'] = df_BTC['close'].rolling(5).mean()
df_BTC['BULL_5'] = df_BTC['SMA_5'] / df_BTC['close']
df_BTC = df_BTC.reset_index()
df_BTC
cache.setex(f"CACHE_get_BULL_5_BTC",20,df_BTC.to_json())
df_BTC.to_json()

df_json_from_redis = cache.get("CACHE_get_BULL_5_BTC")
print(df_json_from_redis)
df_from_redis = pd.read_json(df_json_from_redis)
df_from_redis
```
