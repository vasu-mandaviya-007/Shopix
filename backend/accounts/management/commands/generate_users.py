import random
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker

from accounts.models import Profile

# Agar tumhara Profile model alag se hai, toh usko yahan import kar lena
# from accounts.models import Profile 

class Command(BaseCommand):
    help = 'Generates 100 dummy users for testing'

    def handle(self, *args, **kwargs):
        # 'en_IN' pass karne se Indian names aur phone numbers generate honge
        fake = Faker('en_IN') 
        
        self.stdout.write("Generating 100 dummy users. Please wait...")
        
        created_count = 0
        for i in range(100):
            first_name = fake.first_name()
            last_name = fake.last_name()
            # Username unique banane ke liye random number add kar rahe hain
            username = f"{first_name.lower()}_{last_name.lower()}_{random.randint(1000, 99999)}"
            email = fake.email()
            
            try:
                # 1. User Create hoga (Aur tumhara Django Signal automatically iski Profile bana dega)
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password='password123',
                    first_name=first_name,
                    last_name=last_name
                )
                
                # 2. Profile CREATE mat karo, usko GET karo aur update karo
                profile = Profile.objects.get(user=user)
                profile.phone_number = fake.phone_number()[:15] # [:15] isliye taaki max_length limit cross na ho
                
                # Agar dummy image lagani ho
                # profile.profile_pic = f"https://ui-avatars.com/api/?name={first_name}+{last_name}"
                
                profile.save()
                
                created_count += 1
                
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Error creating user {username}: {e}"))

        self.stdout.write(self.style.SUCCESS(f"Successfully created {created_count} dummy users!"))
        self.stdout.write(self.style.WARNING("Note: All users have the password 'password123'"))