from django.db import models
from django.contrib.auth.models import User



class Stock(models.Model):
    name = models.CharField(max_length=200)
    symbol = models.CharField(max_length = 100, unique=True)
    price = models.FloatField()
    # updated = models.DateTimeField(auto_now_add=True)
    change_percent = models.FloatField(default=0.0)
    favorite = models.BooleanField(default=False);
    is_fund = models.BooleanField(default=False)
    is_etf = models.BooleanField(default=False)

    def __str__(self):
        return self.symbol
    
class Wallet(models.Model):
    owner_choices = [
        ('Ricardo', 'Ricardo'),
        ('Itala', 'Itala'),
        ('Thayssa', 'Thayssa'),
        ('Caco', 'Caco'),
    ]
    broker_choices = [
        ('Ágora - Bradesco', 'Ágora - Bradesco'),
        ('Banco do Brasil', 'Banco do Brasil'),
        ('Itaú', 'Itaú'),
    ]
    buy_date = models.DateField('Data de Compra', auto_now=False, auto_now_add=False)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE)
    investment = models.FloatField()
    money_amount = models.FloatField()
    stock_amount = models.IntegerField()
    buy_price = models.FloatField()
    owner = models.CharField(choices=owner_choices, max_length=20)
    broker = models.CharField(choices = broker_choices, max_length=20)

    def __str__(self):
        return self.stock.symbol

    class Meta:
        unique_together = ['owner', 'stock', 'broker']


class Transaction(models.Model):
    options_operation = [
        ('Compra', 'Compra'),
        ('Compra e Venda', 'Compra e Venda'),
        ('Venda', 'Venda')
    ]   
    broker_choices = [
        ('Ágora - Bradesco', 'Ágora - Bradesco'),
        ('Banco do Brasil', 'Banco do Brasil'),
        ('Itaú', 'Itaú'),
    ]
    owner_choices = [
        ('Ricardo', 'Ricardo'),
        ('Itala', 'Itala'),
        ('Thayssa', 'Thayssa'),
        ('Caco', 'Caco'),
    ]
    stock = models.CharField(max_length=50)
    operation = models.CharField(max_length=25, choices=options_operation)
    document = models.FileField('documents/pdfs')
    date = models.DateField('Data da transação',auto_now=False, auto_now_add=False)
    broker = models.CharField(max_length=25, choices=broker_choices)
    owner = models.CharField(max_length=20, choices=owner_choices)

    def __str__(self):
        return (str(self.id) + ' - ' + str(self.operation) + ' ' + str(self.stock))
