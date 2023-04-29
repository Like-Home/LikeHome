from math import ceil

from rest_framework import pagination
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param


class BasePagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'size'
    max_page_size = 100

    def get_paginated_response(self, data):
        url = self.request.build_absolute_uri()

        return Response({
            'links': {
                'generic': replace_query_param(url, self.page_query_param, 'PAGE_NUMBER'),
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'page_total': ceil(self.page.paginator.count / self.page_size),
            'page_size': self.page_size,
            'total': self.page.paginator.count,
            'results': data
        })
