from django.urls import path
from . import views

urlpatterns = [
    path('info/', views.InfoAPIView.as_view(), name='infopage'),
    path('stock/', views.Stocks_dbQuery.as_view(), name="stockdbquerypage"),
    path('stock/get/<str:pk>', views.Stocks_Historical.as_view(), name="gethistoricaldatapage"),
    path('stock/update/<str:pk>', views.Update_Stocks.as_view(), name="updatestockpage"),
    path('index/get/', views.Index.as_view(), name="getindexpage"),
    path('forex/get/', views.Forex_Historical.as_view(), name="getforexpage"),
    path('index/historical/', views.Index_Historical.as_view(), name="getindexhistoricalpage"),
    path('query/', views.Query_Stocks.as_view(), name='querypage'),
    path('wallet/', views.Wallet_dbQuery.as_view(), name='walletpage'),
    path('transaction/', views.Transaction_dbQuery.as_view(), name='transactionpage'),
    path('ibovespa/monthly/', views.Ibovespa_MonthlyChange.as_view(), name='ibovespamonthlypage'),
    path('wallet/stocks/<str:owner>', views.Wallet_Stocks.as_view(), name='walletstockspage'),
    # path('transaction/download/<str:id>', views.Transaction_Download.as_view(), name='downloadtransactionpage'),

]