from app import config
from rest_framework.throttling import SimpleRateThrottle


class HotelbedsRateThrottle(SimpleRateThrottle):
    def __init__(self):
        # Override the usual SimpleRateThrottle, because we can't determine
        # the rate until called by the view.
        pass

    def allow_request(self, request, view):
        """
        Implement the check to see if the request should be throttled.

        On success calls `throttle_success`.
        On failure calls `throttle_failure`.
        """
        self.key = self.get_cache_key(request, view)
        if self.key is None:
            return True

        self.rate = self.get_rate()
        self.num_requests, self.duration = self.parse_rate(self.rate)

        self.history = self.cache.get(self.key, [])
        self.now = self.timer()

        # Drop any requests from the history which have now passed the
        # throttle duration
        while self.history and self.history[-1] <= self.now - self.duration:
            self.history.pop()
        if len(self.history) >= self.num_requests:
            return self.throttle_failure()
        return self.throttle_success()

    def get_cache_key(self, request, view):
        is_authenticated = request.user and request.user.is_authenticated
        if is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        self.scope = 'user' if is_authenticated else 'anon'

        if request.COOKIES.get('RATELIMIT_BYPASS') == config.RATELIMIT_BYPASS:
            self.scope += "_whitelisted"

        return self.cache_format % {
            'scope': self.scope,
            'ident': ident
        }
