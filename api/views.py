from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.utils import timezone

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.parsers import FileUploadParser

from api.serializers import StockSerializer, WalletSerializer, TransactionSerializer
from api.models import Stock, Wallet, Transaction

import investpy
import yfinance as yf
import pandas as pd
import pandas_datareader.data as web
from datetime import datetime, date, timedelta
import json

# stock query ✅
# etf query ✅
# create stock ✅
# read stock✅ 
# update stock✅
# delete stock✅
# create wallet✅ 
# read wallet✅
# update wallet ✅
# delete wallet ✅
# create transaction 
# read transaction
# delete transaction
# forex page
# bvsp page ✅
# dashboard page
# wallet page

class Update_Stocks(APIView): #✅
  def get(self, request, pk=None):
    if not pk:
      return Response({'error': 'Missing stock primary key in url!'})
    
    try:
      stock = Stock.objects.get(pk=pk)

    except:
      return Response({'error': 'Specified primary key is not in our database, please add the stock to your portfolio before updating it!'})
      
    serializer = StockSerializer(stock)
    updated, instance = serializer.update(stock)
    updated_serializer = StockSerializer(instance)
    if updated:
      context = {
        "success": "Stock updated successfully",
        "updated_stock": updated_serializer.data,

      }
      return Response(context, status=200)
    else:
      return Response({"error":"Something prevented the update from being executed"}, status=400)
      

class Forex_Historical(APIView): #✅
  def get(self, request, *args, **kwargs):
    name = request.GET.get('name')
    if not (name):
      return Response({'error': 'missing arguments'})


    obj = get_forexes_data(name)

    context = {
      'object': obj
    }
    return Response(context)


class Index_Historical(APIView): #✅
  def get(self, request, *args, **kwargs):
    name = request.GET.get('name')
    if not (name):
      return Response({'error': 'missing arguments'})


    obj = get_historical_index_data(name)

    context = {
      'data': json.loads(obj)
    }
    return Response(context)


class Index(APIView): #✅
  def get(self, request, *args, **kwargs):
    name = request.GET.get('name')
    country = request.GET.get('country')
    if not (name and country):
      return Response({'error': 'missing arguments'})


    obj = get_indexes_data(name, country)

    context = {
      'object': obj
    }
    return Response(context)


class Stocks_Historical(APIView): #✅
  
  def get(self, request, pk=None):
    stock = Stock.objects.get(pk=pk)
    obj = get_historical_data(stock.symbol)
    
    indicators = get_indicators(stock.symbol)

    context = {
      'name': stock.name,
      'data': json.loads(obj),
      'indicator': indicators
    }
    return Response(context)


class InfoAPIView(APIView): #✅
  
  def get(self, request):
    
    context = {
      'Fetch Stock Data': 'api/stock/get-<sigla>',
      'Database get/post/put/delete': 'api/database',
    }

    return Response(context)


class Stocks_dbQuery(APIView):#✅
  
  def get(self, request):
    stocks = Stock.objects.all()
    serializer = StockSerializer(stocks, many=True)


    return Response(serializer.data, status=200)

  def post(self, request, *args, **kwargs):
    data = request.data
    serializer = StockSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=201)
    return Response(serializer.errors)

  
  def put(self, request):
    stock_id = request.data.get('pk')
    stock = Stock.objects.get(pk=stock_id)
    stock.favorite = not stock.favorite
    stock.save()
    return Response({stock.symbol: stock.favorite}, status=202)
  
  def delete(self, request):
    stock_id = request.GET.get('pk')
    stock = Stock.objects.get(pk=stock_id)
    stock.delete()

    context = {
      'success': 'Stock deleted successfully'
    }
    return Response(context, status=201)
  

class Wallet_dbQuery(APIView): #✅
  
  def get(self, request):
    owner = request.GET.get('owner')
    wallet = Wallet.objects.filter(owner=owner)
    for item in wallet:
      item.money_amount = item.stock_amount *item.stock.price
      item.save()
    
    serializer = WalletSerializer(wallet, many=True)
    for item in serializer.data:
      stock = Stock.objects.get(pk=item['stock'])
      item['change_percent'] = round(100*(item['money_amount'] - item['investment'])/item['investment'],2)
      item['ibovespa_change'] = comparison_stock_with_bovespa(item['buy_date'])
      item['stock'] = {
        'name': stock.name,
        'symbol': stock.symbol,
        'price': stock.price,
        'is_etf': stock.is_etf,
        'is_fund': stock.is_fund,
      }

    return Response(serializer.data, status=200)
  
  def post(self, request, *args, **kwargs):
    print(request.data)
    broker = request.data['broker']
    owner = request.data['owner']
    buy_date = request.data['buy_date']
    investment = float(request.data['investment'])
    stock_amount = int(request.data['stock_amount'])
    stock = Stock.objects.filter(symbol=str(request.data['symbol']))
    if not stock:
      return Response({'error': 'Não há ativos com este nome em seu portfólio'})
    else:
      stock = stock[0]

    
    
    # validation
    if owner not in ['Ricardo', 'Itala', 'Thayssa', 'Caco']:
      return Response({'error':'Owner not recognized'})
    
    if broker not in ['Ágora - Bradesco', 'Banco do Brasil', 'Itaú']:
      return Response({'error':'Broker not recognized'})
    
    validated_data = {
      'broker':broker,
      'owner': owner,
      'investment': investment,
      'stock_amount': stock_amount,
      'stock': stock.pk,
      'money_amount': stock.price * stock_amount,
      'buy_price': investment/stock_amount,
      'buy_date' : buy_date
    }
    serializer = WalletSerializer(data=validated_data)
    
    if serializer.is_valid():
      serializer.save()
      return Response({'success':'Created wallet item successfully'}, status=201)
    else:
      print(serializer.errors)
      print(serializer.error_messages)
      return Response({'error': "serializer isn't valid"})
  
  def put(self, request, *args, **kwargs):
    print(request.data)
    instance = Wallet.objects.get(pk=int(request.data.get('pk')))
    serializer = WalletSerializer(instance=instance)
    serializer.update(validated_data=request.data)

    return Response({'success': 'object updated successfully'})
  
  def delete(self, request, *args, **kwargs):
    wallet_id = request.GET.get('pk')
    instance = Wallet.objects.get(pk=wallet_id)
    instance.delete()

    context = {
      'success': 'Wallet item deleted successfully'
    }
    return Response(context, status=201)


class Wallet_Stocks(APIView):
  def get(self, request, owner=None, *args, **kwargs):
    wallet = Wallet.objects.filter(owner=owner)
    stocks = [item.stock for item in wallet]
    for instance in stocks:
      if instance.is_etf:
        new_obj = get_etf_data(instance.symbol)
      else:
        new_obj = get_stock_data(instance.symbol)
      instance.price=new_obj['price']
      instance.change_percent=new_obj['change_percent']
      instance.save()
    serializer = StockSerializer(stocks, many=True)
    
    return Response(serializer.data, status=202)


class Transaction_dbQuery(APIView):
  # parser_classes = [FileUploadParser]

  def get(self, request, *args, **kwargs):
    owner = request.GET.get('owner')
    transactions = Transaction.objects.filter(owner=owner)
    serializer = TransactionSerializer(transactions, many=True)
    # print(serializer.data)
    return Response(serializer.data)

  def post(self, request, *args, **kwargs):
    # print(request.data)
    stock = request.data.get('stock')
    operation = request.data.get('operation')
    date = request.data.get('date')
    broker = request.data.get('broker')
    owner = request.data.get('owner')
    document = request.FILES['document']

    obj = Transaction.objects.create(
      stock = stock,
      operation = operation,
      date = date,
      broker = broker,
      owner = owner,
      document = document,
    )
    obj.save()
    return Response({'success': 'object created'}, status=201)
  
  def delete(self, request, *args, **kwargs):
    pk = request.GET.get('pk')
    instance = Transaction.objects.get(pk=pk)
    instance.delete()

    return Response({'success': 'item deleted'})


class Query_Stocks(APIView): #✅
  
  def get(self, request, *args, **kwargs):
    symbol = request.GET.get('symbol')
    obj = get_historical_data(symbol)
    indicator = get_indicators(symbol)
    context = {
      'data': json.loads(obj),
      'indicator': indicator
    }
    return Response(context)


class Ibovespa_MonthlyChange(APIView):
  def get(self, request, *args, **kwargs):
    obj = get_bvsp_monthly_change_percent()

    return Response({'data': obj})


# Utilities functions

def get_stock_data(symbol :str):
  try: 
    df = investpy.stocks.get_stock_recent_data(stock=symbol, country='brazil')

  except:
    sym = yf.Ticker(symbol+'.SA')
    df = sym.history(period='5d')

  obj = {
    'price': df.Close[-1],
    'change_percent': round(((df.Close[-1]-df.Close[-2])/df.Close[-2])*100, 2),
    'symbol': symbol,
  }
  return obj

def get_new_stock_data(symbol :str):
  try: 
    df = investpy.stocks.get_stock_recent_data(stock=symbol, country='brazil')
    name = get_name(symbol)

  except:
    sym = yf.Ticker(symbol+'.SA')
    df = sym.history(period='5d')
    name = sym.info['shortName']

    


  obj = {
    'price': df.Close[-1],
    'change_percent': round(((df.Close[-1]-df.Close[-2])/df.Close[-2])*100, 2),
    'symbol': symbol,
    'name': name,
  }
  return obj


def get_etf_data(symbol: str):
   
  name = investpy.etfs.search_etfs(by='symbol', value=symbol).name[0]
  df = investpy.etfs.get_etf_recent_data(etf=name, country='brazil')

  obj = {
    'price': df.Close[-1],
    'change_percent': round(((df.Close[-1]-df.Close[-2])/df.Close[-2])*100, 2),
    'symbol': symbol,
    'name': name,
  }
  return obj


def get_name(symbol :str):
  name = investpy.search_stocks(by='symbol', value=symbol).at[0, 'full_name']
  return name


def get_indicators(symbol :str):

  pp = investpy.technical.pivot_points(name=symbol, country='brazil', product_type='stock', interval='daily')
  ma = investpy.technical.moving_averages(name=symbol, country='brazil', product_type='stock', interval='daily')
  tf = investpy.technical.technical_indicators(name=symbol, country='brazil', product_type='stock', interval='daily')
  resistances = [pp.r1[0], pp.r2[0], pp.r3[0]]
  supports = [pp.s1[0], pp.s2[0], pp.s3[0]]
  ema = ma.ema_value[1]
  ema_signal = ma.ema_signal[1]
  indicators = []
  for i in range(len(tf)):
    indicators.append(
      {
        'indicator': tf.technical_indicator[i],
        'signal': tf.signal[i],
      }
      )

  obj = {
    'resistances': resistances,
    'supports': supports,
    'ema': ema,
    'ema_signal': ema_signal,
    'momentum': indicators,
  }

  return obj


def get_stock_specs(symbol :str):
  search_results = investpy.search(text=symbol)
  s = search_results[0]


def get_indexes_data(name :str, country: str):
  # name : 'Bovespa', country='brazil'
  # name : 'S&P 500', country='united states'
  # name : 'Nasdaq', country='united states'
  # name : 'Dow 30', country='united states'
  today = datetime.today().strftime("%d/%m/%Y")
  yesterday = (datetime.today() - timedelta(days=5)).strftime("%d/%m/%Y")
  df = investpy.indices.get_index_historical_data(index=name, country=country, from_date=yesterday, to_date=today, as_json=False, order='ascending', interval='Daily')
  change_percent = (df.Close[-1]-df.Close[-2])/df.Close[-2]

  return {
    'name': name,
    'price': df.Close[-1],
    'change_percent': round(change_percent*100,2),
  }


def get_forexes_data(name :str):
  # name : 'Bovespa', country='brazil'
  # name : 'S&P 500', country='united states'
  # name : 'Nasdaq', country='united states'
  # name : 'Dow 30', country='united states'
  today = datetime.today().strftime("%d/%m/%Y")
  yesterday = (datetime.today() - timedelta(days=5)).strftime("%d/%m/%Y")
  df = investpy.currency_crosses.get_currency_cross_recent_data(currency_cross=name+'/BRL')
  df_dict = investpy.currency_crosses.get_currency_crosses_dict(base=name, second='BRL', columns=['base_name', 'second_name'], as_json=False)
  change_percent = (df.Close[-1]-df.Close[-2])/df.Close[-2]
  df_dict = df_dict[0]
  print(df_dict)
  full_name = df_dict['base_name']+' / '+df_dict['second_name']

  return {
    'name': full_name,
    'price': df.Close[-1],
    'change_percent': round(change_percent*100,2),
  }


def get_historical_data(symbol :str):
  try:
    today = datetime.today().strftime("%d/%m/%Y")
    yesterday = (datetime.today() - timedelta(days=200)).strftime("%d/%m/%Y")
    df_json = investpy.get_stock_historical_data(stock=symbol, country='brazil', from_date=yesterday, to_date=today, as_json=True, order='descending', interval='Daily')
  except:
    df = yf.Ticker(symbol.upper() + '.SA').history(period='6mo')
    df = df.rename(columns=str.lower)
    df = df.rename_axis('date', axis='rows')
    df = df.iloc[::-1]
    df.index = df.index.strftime('%d/%m/%Y')
    df_json = json.loads(df.to_json(orient='table'))
    df_json.pop('schema')
    df_json['historical'] = df_json.pop('data')
    df_json = json.dumps(df_json)
    
  return df_json


def get_historical_index_data(symbol :str):
  try:
    today = datetime.today().strftime("%d/%m/%Y")
    yesterday = (datetime.today() - timedelta(days=200)).strftime("%d/%m/%Y")
    df_json = investpy.indices.get_index_historical_data(index=symbol, country='brazil', from_date=yesterday, to_date=today, as_json=True, order='descending', interval='Daily')
    
  except:
    df = yf.Ticker(symbol.upper() + '.SA').history(period='6mo')
    df = df.rename(columns=str.lower)
    df = df.rename_axis('date', axis='rows')
    df = df.iloc[::-1]
    df.index = df.index.strftime('%d/%m/%Y')
    df_json = json.loads(df.to_json(orient='table'))
    df_json.pop('schema')
    df_json['historical'] = df_json.pop('data')
    df_json = json.dumps(df_json)
    
  return df_json


def get_bvsp_monthly_change_percent():
  today = datetime.today()
  # yesterday = (datetime.today() - timedelta(days=200)).strftime("%d/%m/%Y")
  df_months = investpy.indices.get_index_historical_data(index='Bovespa', country='brazil',
                                                      from_date='30/03/2020', to_date=today.strftime("%d/%m/%Y"),
                                                      as_json=False, order='descending', 
                                                      interval='Monthly')
  fdotm = today.replace(day=1)
  df_now = investpy.indices.get_index_historical_data(index='Bovespa', country='brazil',
                                                      from_date=fdotm.strftime("%d/%m/%Y"), to_date=today.strftime("%d/%m/%Y"),
                                                      as_json=False, order='descending', 
                                                      interval='Daily')
  mask = (df_now.index > (fdotm - timedelta(days=1))) & (df_now.index <= today)
  df = df_now.loc[mask]
  month_changes = []
  for i in range(len(df_months)-1):
    change_percent = round(100*(df_months.Close[i]-df_months.Close[i+1])/df_months.Close[i+1],4)
    month_changes.insert(0,{ 'month': df_months.index[i].strftime("%B"), 'change_percent': change_percent})
  change_percent = round(100*(df.Close[0]-df.Open[-1])/df.Open[-1],3)
  month_changes.append({'month': df.index[-1].strftime("%B"), 'change_percent': change_percent})

  return month_changes


def comparison_stock_with_bovespa(buy_date: str):
  
  today = datetime.today().date().strftime("%d/%m/%Y")
  start_date = datetime.strptime(buy_date, "%Y-%m-%d").date().strftime("%d/%m/%Y")
  df = investpy.indices.get_index_historical_data(index='Bovespa', country='brazil', from_date=start_date, to_date=today, as_json=False, order='ascending', interval='Daily')
  change_percent = round(100*(df.Open[-1]-df.Close[0])/df.Close[0], 2)

  return change_percent