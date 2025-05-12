from django.core.management.base import BaseCommand
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Создает тестовых пользователей'

    def handle(self, *args, **kwargs):
        # Создаем первого студента
        student1, created = CustomUser.objects.get_or_create(
            username='studentik1',
            defaults={
                'email': 'email_studenta@mail.ru',
                'first_name': 'Лев',
                'last_name': 'Алексеев',
                'is_active': True
            }
        )
        if created:
            student1.set_password('krutoi_password')
            student1.save()
            self.stdout.write(self.style.SUCCESS('Создан студент 1'))
        else:
            self.stdout.write(self.style.WARNING('Студент 1 уже существует'))

        # Создаем второго студента
        student2, created = CustomUser.objects.get_or_create(
            username='studentik2',
            defaults={
                'email': 'email_studenta_2@mail.ru',
                'first_name': 'Захар',
                'last_name': 'Шакиров',
                'is_active': True
            }
        )
        if created:
            student2.set_password('krutoi_password_2')
            student2.save()
            self.stdout.write(self.style.SUCCESS('Создан студент 2'))
        else:
            self.stdout.write(self.style.WARNING('Студент 2 уже существует')) 