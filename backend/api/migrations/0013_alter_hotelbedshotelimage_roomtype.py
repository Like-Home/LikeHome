# Generated by Django 4.1.7 on 2023-03-21 23:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_alter_hotelbedshotelwildcard_characteristiccode_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hotelbedshotelimage',
            name='roomType',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
