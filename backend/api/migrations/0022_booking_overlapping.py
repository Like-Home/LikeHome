# Generated by Django 4.1.7 on 2023-04-23 17:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0021_booking_points_spent'),
    ]

    operations = [
        migrations.AddField(
            model_name='booking',
            name='overlapping',
            field=models.BooleanField(default=False),
        ),
    ]
