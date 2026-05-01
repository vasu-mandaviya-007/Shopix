import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker

# 🌟 DHYAN DEIN: Yahan apne app ka naam aur models theek se import karna
# Maan lo tumhara Product aur Review model 'products' app me hai:
from products.models import Product, Review 

class Command(BaseCommand):
    help = 'Generates 100 dummy reviews for a specific product'

    def add_arguments(self, parser):
        # Command line me product_id lene ke liye
        parser.add_argument('product_id', type=str, help='The ID or UID of the product')

    def handle(self, *args, **kwargs):
        product_id = kwargs['product_id']
        fake = Faker('en_IN')

        # 1. Product fetch karo
        try:
            # Agar primary key 'id' hai toh uid ki jagah id likhna
            product = Product.objects.get(uid=product_id) 
        except Product.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Product with ID '{product_id}' nahi mila!"))
            return

        # 2. Database se pehle 100 users uthao
        users = User.objects.all()[:100]
        
        if users.count() == 0:
            self.stdout.write(self.style.ERROR("Database me users nahi hain. Pehle users generate karo."))
            return

        self.stdout.write(f"'{product.title}' ke liye reviews generate ho rahe hain. Please wait...")

        created_count = 0
        for user in users:
            # E-commerce me 4 aur 5 star reviews zyada aate hain, isliye random weights set kiye hain
            rating = random.choices([1, 2, 3, 4, 5], weights=[5, 10, 10, 30, 45], k=1)[0]
            
            # Ek mast sa random review comment generate karo
            comment = fake.paragraph(nb_sentences=3)

            try:
                # update_or_create use kar rahe hain taaki agar user ka review pehle se ho to error na aaye
                Review.objects.update_or_create(
                    product=product,
                    user=user,
                    defaults={
                        'rating': rating,
                        'comment': comment
                    }
                )
                created_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully {created_count} reviews generate ho gaye!"))