# orders/utils.py

from django.template.loader import get_template
from django.http import HttpResponse
from xhtml2pdf import pisa
from django.db.models import Sum,F
from django.db.models.functions import Coalesce


def generate_order_invoice_pdf(order):
    """
    Generate Order Invoice PDF
    """
    # 1. Bill Calculations

    '''In Django, Coalesce is a database function that takes a list of at least two field names or expressions 
    and returns the first non-null value. It is primarily used to handle NULL values at the database level, 
    allowing you to provide fallback or default values directly in your Django QuerySet. '''
    
    mrp_aggregation = order.items.aggregate(
        cal_total_mrp = Sum(
            Coalesce('original_price','price') * F('quantity')
        )
    )
    total_mrp = mrp_aggregation['cal_total_mrp'] or 0
    mrp_discount = total_mrp - order.subtotal()

    # 2. HTML Setup
    template = get_template("invoice.html")
    context = {"order": order, "total_mrp": total_mrp, "mrp_discount": mrp_discount}
    html = template.render(context)

    # 3. PDF Generation
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="Shopix_Invoice_{order.uid}.pdf"'

    pisa_status = pisa.CreatePDF(html, dest=response)

    # 4. Error Handling
    if pisa_status.err:
        return None
        
    return response