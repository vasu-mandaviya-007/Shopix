from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from .models import ProductImage
import os
import cloudinary.uploader

@receiver(post_delete, sender=ProductImage)
def delete_image_file(sender, instance, **kwargs):
    """
    Deletes image file from filesystem
    when corresponding ProductImage object is deleted.
    """
    try : 
        if instance.image:
            # Delete file from filesystem
            # if os.path.isfile(instance.image.path):
            #     os.remove(instance.image.path)

            # Delete image from Cloudinary
            cloudinary.uploader.destroy(instance.image.public_id)
    except Exception as e:
        print(e)
        return

