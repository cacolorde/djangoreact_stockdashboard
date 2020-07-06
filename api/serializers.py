from rest_framework import serializers

from api.models import Wallet, Stock, Transaction
from . import views


class StockSerializer(serializers.ModelSerializer):
	price = serializers.FloatField(required=False)
	name = serializers.CharField(required=False)
	change_percent = serializers.FloatField(required=False)
	favorite = serializers.BooleanField(required=False, default=False)
	is_fund = serializers.BooleanField(required=False, default=False)
	is_etf = serializers.BooleanField(required=False, default=False)

	class Meta:
		model = Stock
		fields = [
			'pk',
      'name',
			'symbol',
			'price',
			'change_percent',
			'favorite',
      'is_etf',
      'is_fund',
		]

	def create(self, validated_data):
		symbol = validated_data['symbol']
		is_etf = validated_data['is_etf']
		is_fund = validated_data['is_fund']
		if is_etf:
			jsobj = views.get_etf_data(symbol)
		
		else:
			jsobj = views.get_new_stock_data(symbol)

		validated_data = jsobj
		instance = Stock.objects.create(
			symbol=validated_data['symbol'],
			name=validated_data['name'],
			change_percent=validated_data['change_percent'],
			price=validated_data['price'],
			is_etf=is_etf,
			is_fund=is_fund,
		)
		instance.save()
		return instance
	
	def update(self, instance):
		if instance.is_etf:
			new_obj = views.get_etf_data(instance.symbol)
		else:
			new_obj = views.get_stock_data(instance.symbol)
		instance.price=new_obj['price']
		instance.change_percent=new_obj['change_percent']
		instance.save()
		return True, instance

	


class WalletSerializer(serializers.ModelSerializer):
	buy_price = serializers.FloatField(required=False)
	money_amount = serializers.FloatField(required=False)
	class Meta:
		model = Wallet
		fields = [
			'pk',
			'buy_date',
			'stock',
			'stock_amount',
			'buy_price',
			'investment',
			'money_amount',
			'owner',
			'broker',
		]

	def create(self, validated_data):

		instance = Wallet.objects.create(
			stock=validated_data['stock'],
			stock_amount=validated_data['stock_amount'],
			buy_price=validated_data['buy_price'],
			money_amount=validated_data['money_amount'],
			investment=validated_data['investment'],
			owner=validated_data['owner'],
			broker=validated_data['broker'],
			buy_date=validated_data['buy_date'],
		)
		instance.save()
		return instance
	
	def update(self, validated_data=None):
		if validated_data == None:
			money_amount = round(self.instance.stock.price * self.instance.stock_amount, 2)
			self.instance.money_amount = money_amount
			self.instance.save()
		else:
			stock_amount = validated_data['stock_amount']
			investment = validated_data['investment']
			stock_amount_new = (stock_amount + self.instance.stock_amount)
			investment_new = self.instance.investment + investment
			buy_price_new = investment_new/stock_amount_new
			money_amount_new = stock_amount_new*self.instance.stock.price
			self.instance.investment = investment_new
			self.instance.money_amount = money_amount_new
			self.instance.stock_amount = stock_amount_new
			self.instance.buy_price = buy_price_new
			self.instance.save()

		return self.instance
		

class TransactionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Transaction
		fields = [
			'pk',
			'stock',
			'operation',
			'document',
			'date',
			'broker',
			'owner',
		]