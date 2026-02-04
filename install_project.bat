@echo off
echo [INFO] Dang cai dat thu vien (npm install)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Loi khi chay npm install. Vui long kiem tra lai Node.js.
    pause
    exit /b %errorlevel%
)

echo.
echo [INFO] Setup hoan tat!
echo [INFO] Ban hay tao file .env tu .env.example va dien thong tin Supabase nhe.
echo.
pause