Write-Host "Starting Development Environment..." -ForegroundColor Green

# 1. Frontend terminal
Write-Host "Starting Frontend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

# 2. Backend Server terminal (.venv activate and runserver)
Write-Host "Starting Django Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\.venv\Scripts\Activate.ps1; python manage.py runserver"

# 3. Tailwind terminal (.venv activate and tailwind start)
Write-Host "Starting Tailwind..." -ForegroundColor Cyan
# (Maine isme bhi venv activate add kiya hai kyunki manage.py run karne ke liye environment chahiye hota hai)
Start-Process powershell -ArgumentList "-NoExit", "-Command", ".\.venv\Scripts\Activate.ps1; python manage.py tailwind start"

# 4. Stripe Webhook terminal
Write-Host "Starting Stripe Webhook..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; stripe listen --forward-to localhost:8000/api/orders/webhook/"

Write-Host "All external terminals launched successfully!" -ForegroundColor Green