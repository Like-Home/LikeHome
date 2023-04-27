from app import config
from django.contrib.auth.models import User
from django.db import models
from django.db.models import IntegerField, signals
from templated_email import send_templated_mail


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    travel_points = IntegerField(default=0)
    phone_number = models.CharField(max_length=30, blank=True)
    autofill_booking_info = models.BooleanField(default=False)

    def _str_(self):
        return self.user.username


def auto_create_account(sender, instance, created, **kwargs):
    if created:
        Account.objects.create(user=instance)

        send_templated_mail(
            recipient_list=[instance.email],
            to=[f'{instance.first_name} {instance.last_name} <{instance.email}>'],
            template_name='welcome',
            from_email='LikeHome <noreply@likehome.dev>',
            context={
                'subject': '👋🏠💛 Welcome to LikeHome!',
                'email_title': 'We promise not to steal your towels!',
                'image': {
                    'src': 'https://media3.giphy.com/media/hr4Ljjyj0L9RYlihLr/200w.gif?cid=6c09b952toscv9q7ku465sl8n5ldpf9c0rc1h6yq4wngpsau&ep=v1_gifs_search&rid=200w.gif&ct=g',
                    'alt': 'Welcome!',
                    'subtitle1': 'Our home just got a little bit bigger.',
                    'subtitle2': 'We\'re so excited to have you!',
                },
                'thank_you_tag': 'Thank you for choosing us!',
                'content_title': '👋🏠💛',
                'contact_us_email': 'support@likehome.dev',
                'header_logo_url': 'https://raw.githubusercontent.com/Like-Home/LikeHome/main/frontend/static/favicon.png',
                'rendered_online': True,
                'base_url': config.BASE_URL,
            },
            create_link=True,
        )


signals.post_save.connect(auto_create_account, sender=User)
