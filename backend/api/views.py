# django imports
from django.contrib.auth.models import User

# restframewor imports
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import CreateAPIView

# others
from datetime import datetime

# local imports
# Todo App
from api.serializers import TodoSerializer, BasektSerialzier
from api.models import Todo, Basket

# Create your views here.

class TodosView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """ Get all todos """
        baskets = Basket.objects.filter(user = request.user)
        serializer = BasektSerialzier(baskets, many=True)
        return Response({
          'status': True,
          'data': serializer.data
        })

    def post(self, request):
        """ Adding a new todo. """

        data = {'user': request.user.id}
        data.update(request.data)
        serializer = TodoSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=
                status.HTTP_400_BAD_REQUEST)
        else:
            serializer.save()
            dictV = {
              'status': True,
              'message': 'Todo is successfully added'
            }
            return Response(dictV, status=status.HTTP_201_CREATED)

    def put(self, request):
        """ Update a todo """
        data = request.data
        todo_id = data.get('id')

        if not todo_id:
            return Response({'error': 'Todo id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = Todo.objects.get(id = todo_id)
        except Todo.DoesNotExist as e:
                return Response({'error': 'Invalid Todo id'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TodoSerializer(instance, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=
                status.HTTP_400_BAD_REQUEST)
        else:
            instance.title = data.get('title', instance.title)
            instance.description = data.get('description', instance.description)
            instance.done =  data.get('done', instance.done)
            instance.basket_id = data.get('basket', instance.basket.id)
            instance.save()
            dictV = {
              'message': 'Successfully Updated'
            }
            return Response(dictV, status=status.HTTP_200_OK)
    
    def delete(self, request):
        """ Delete a todo """
        
        data = request.data
        todo_id = data.get('id')

        if not todo_id:
            return Response({'error': 'Todo id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            instance = Todo.objects.get(id = todo_id)
            instance.delete()
            dictV = {
              "message": 'Successfully deleted'
            }
            return Response(dictV, status=status.HTTP_200_OK)
        except Todo.DoesNotExist as e:
            return Response({'error': 'Invalid Todo id'}, status=status.HTTP_400_BAD_REQUEST)
        

class AddBasket(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BasektSerialzier

    def create(self, request, *args, **kwargs):
        data = {
          'name': request.data.get('name'),
          'user': request.user.id
        }
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)