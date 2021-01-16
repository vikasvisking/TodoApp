from django.urls import path
from api.views import TodosView, AddBasket
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path('auth-token', obtain_auth_token, name='api_token_auth'),
    path('todos', TodosView.as_view(), name="todo"),
    path('add-basket', AddBasket.as_view(), name="add_basket")
]
