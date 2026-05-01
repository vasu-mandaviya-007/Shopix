from django import template

register = template.Library()


@register.filter
def typeof(value):
    return type(value).__name__


@register.filter
def rupee(value):
    try:
        # Value ko float me convert karke 2 decimal fix karein
        number = round(float(value), 2)
        
        # Integer aur Decimal (paise) ko alag-alag karein
        int_part = str(int(number))
        dec_part = f"{number:.2f}".split('.')[1]

        # Indian Numbering System (Lakhs, Crores) Logic
        if len(int_part) > 3:
            last_three = int_part[-3:]
            rest = int_part[:-3]
            
            # Baaki bache numbers ko 2-2 ke jode (pairs) me baantein
            rest_parts = [rest[max(0, i-2):i] for i in range(len(rest), 0, -2)]
            rest_parts.reverse()
            
            # Sabko comma se jod dein
            int_part = ",".join(rest_parts) + "," + last_three

        return f"₹{int_part}.{dec_part}"
    except (ValueError, TypeError):
        return value  # Agar koi error aaye toh original value wapas kar do