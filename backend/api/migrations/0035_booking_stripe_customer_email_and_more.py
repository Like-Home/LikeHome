# Generated by Django 4.1.7 on 2023-04-27 22:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0034_remove_booking_amount_original_total'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='stripe_customer_email',
            field=models.CharField(default=None, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='booking',
            name='stripe_customer_name',
            field=models.CharField(default=None, max_length=200, null=True),
        ),
    ]
