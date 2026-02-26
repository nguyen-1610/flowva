@echo off
echo [INFO] Dang cai dat thu vien (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Loi khi chay npm install. Vui long kiem tra lai Node.js.
    pause
    exit /b %errorlevel%
)

echo.
echo [INFO] Tu dong tao file .env.local tu .env.example...
if not exist .env.local (
    copy .env.example .env.local
    echo [SUCCESS] Da tao file .env.local.
) else (
    echo [SKIP] File .env.local da ton tai.
)

echo.
echo [INFO] SETUP HOAN TAT!
echo [IMPORTANT] Ban hay dam bao Docker dang chay, sau do go lenh sau:
echo            supabase start
echo.
pause