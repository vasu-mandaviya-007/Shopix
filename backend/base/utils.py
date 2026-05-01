def format_inr(number):
    """Convert number to Indian Rupee format (Lakhs, Crores)"""
    try:
        amount = float(number or 0)
        is_negative = amount < 0
        amount = abs(amount)
        
        # Point se pehle aur baad ke numbers alag karna
        int_part = str(int(amount))
        dec_part = f"{amount:.2f}".split('.')[1]
        
        # Indian System logic: Pehle 3, fir 2-2 ka gap
        if len(int_part) > 3:
            last_3 = int_part[-3:]
            rest = int_part[:-3]
            
            res = ""
            while len(rest) > 2:
                res = "," + rest[-2:] + res
                rest = rest[:-2]
            int_part = rest + res + "," + last_3
            
        formatted = f"{int_part}.{dec_part}"
        return f"-₹ {formatted}" if is_negative else f"₹ {formatted}"
    except (ValueError, TypeError):
        return "₹ 0.00"