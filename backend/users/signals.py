from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.conf import settings
from .models import CustomUser

@receiver(user_logged_in)
def initialize_shop_items_on_login(sender, user, request, **kwargs):
    # Количество предметов в магазине (можно вынести в settings)
    items_count = getattr(settings, 'SHOP_ITEMS_COUNT', 8)
    if isinstance(user, CustomUser):
        user.initialize_shop_items(items_count=items_count) 