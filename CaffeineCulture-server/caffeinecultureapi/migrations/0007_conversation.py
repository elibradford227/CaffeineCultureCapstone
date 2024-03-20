# Generated by Django 4.1.3 on 2024-03-02 19:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('caffeinecultureapi', '0006_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='Conversation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('participants', models.ManyToManyField(related_name='conversations', to='caffeinecultureapi.user')),
            ],
        ),
    ]