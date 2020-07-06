from django.contrib import admin
from api.models import Stock, Wallet, Transaction
# Register your models here.
admin.site.register(Stock)
admin.site.register(Wallet)
admin.site.register(Transaction)