from typing import Any

from api.serializers import UserSerializer
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response


class UserView(viewsets.ReadOnlyModelViewSet, viewsets.mixins.UpdateModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get('pk')

        if pk == "me":
            return self.request.user

        # TODO: only allow admins to list all other users
        return super().get_object()

    def update(self, request: Request, *args: Any, **kwargs: Any) -> Response:
        user = self.get_object()

        if user != request.user:
            return Response(status=403)

        return super().update(request, *args, **kwargs)
