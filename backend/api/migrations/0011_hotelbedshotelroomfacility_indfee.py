# Generated by Django 4.1.7 on 2023-03-21 23:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_rename_hotelbedshotelinterestpoints_hotelbedshotelinterestpoint'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotelbedshotelroomfacility',
            name='indFee',
            field=models.BooleanField(null=True),
        ),
    ]
