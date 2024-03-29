# Generated by Django 4.1.7 on 2023-03-21 23:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_hotelbedshotelroom_roomtype'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hotelbedshotel',
            name='accommodationType',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.hotelbedsaccommodation'),
        ),
        migrations.AlterField(
            model_name='hotelbedshotel',
            name='chain',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.hotelbedschain'),
        ),
        migrations.AlterField(
            model_name='hotelbedshotel',
            name='email',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='hotelbedshotel',
            name='web',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='hotelbedshotelinterestpoint',
            name='poiName',
            field=models.CharField(max_length=255, null=True),
        ),
    ]
