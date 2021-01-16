from rest_framework import serializers
from api.models import Todo, Basket

class TodoSerializer(serializers.ModelSerializer):
    basket = serializers.CharField(source='basket.name')

    class Meta:
        model = Todo
        fields = '__all__'
        extra_kwargs = {
          'user': {'write_only': True},
          'updated': {'read_only': True}
        }
    
    def create(self, validated_data):
      basket = validated_data.pop('basket', None)
      instance = Todo(**validated_data)
      instance.basket_id = basket.get('name')
      instance.save()
      return instance

class BasektSerialzier(serializers.ModelSerializer):
    todo_set = TodoSerializer(many = True, read_only=True)
    class Meta:
        model = Basket
        fields = '__all__'
        extra_kwargs = {
          'user': {'write_only': True}
        }