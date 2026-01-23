@echo off
echo ==========================================
echo   DANG CAI DAT THU VIEN CHO DU AN...
echo   (Vui long cho doi, co the mat vai phut)
echo ==========================================

:: 1. Cài đặt các thư viện trong package.json
call npm install

echo.
echo ==========================================
echo   DANG KHOI TAO PRISMA CLIENT...
echo ==========================================

:: 2. Generate Prisma Client (Quan trọng)
call npx prisma generate

echo.
echo ==========================================
echo   CAI DAT HOAN TAT! 
echo   Bam phim bat ky de thoat...
echo ==========================================
pause