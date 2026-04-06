from django.db import models
import uuid


class BaseModel(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Saves the date & time only when the object is first created. Value does not change later.
    created_at = models.DateTimeField(auto_now_add=True)

    # Automatically updates field every time the object is updated & saved.
    updated_at = models.DateTimeField(auto_now=True)

    # Meta = Settings for the model, not the data of the model, It controls how Django treats the model behind the scenes.
    class Meta:
        # Make the model abstract (no DB table created)
        abstract = True
