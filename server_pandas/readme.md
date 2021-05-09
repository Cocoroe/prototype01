## python flask pandas data process server

- 목적 : 코인 데이터 처리 및 serve

## install

```
1. pip install requirements.txt
2. setting .env
```

## redis-cli

## git push

```
git push https://dosimpact@github.com/Cocoroe/prototype01.git
git push https://[USER_NAME]@github.com/Cocoroe/prototype01.git
```

## installed package

```
pip install redis flask pybithumb
pip install python-dotenv
```

## example code

- caching API ( 2sec caching )

```
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

```
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
