@echo off
REM 🚀 Script สำหรับอัพโหลดระบบเอกสารพัสดุไปยัง GitHub (Windows)

chcp 65001 >nul
cls

echo.
echo ════════════════════════════════════════════════
echo   ระบบเอกสารพัสดุโรงเรียน - GitHub Upload
echo ════════════════════════════════════════════════
echo.

REM ตรวจสอบว่า git ติดตั้งแล้วหรือไม่
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Git ยังไม่ติดตั้ง
    echo    ติดตั้ง Git จาก https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Git ติดตั้งแล้ว
echo.

REM สอบถามรายละเอียด
set /p REPO_URL="📝 GitHub Repository URL (เช่น https://github.com/username/school-procurement-system): "
set /p COMMIT_MSG="💬 Commit message (เช่น Update: Add Garuda seal and summary table): "

if "%REPO_URL%"=="" (
    echo ❌ ต้องกรอก Repository URL
    pause
    exit /b 1
)

if "%COMMIT_MSG%"=="" (
    set COMMIT_MSG=Update: school procurement system
)

REM สอบถามสาขา
set /p BRANCH_INPUT="🌿 Branch name (ค่าเริ่มต้น: main, กด Enter ข้าม): "
if "%BRANCH_INPUT%"=="" (
    set BRANCH_NAME=main
) else (
    set BRANCH_NAME=%BRANCH_INPUT%
)

echo.
echo ════════════════════════════════════════════════
echo   เริ่มการอัพโหลด...
echo ════════════════════════════════════════════════
echo.

REM ขั้นตอน 1: ตั้งค่า git
echo ⏳ ขั้นตอนที่ 1: ตั้งค่า Git repository...
git init
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ไม่สามารถสร้าง repository
    pause
    exit /b 1
)
echo ✅ Git repository สร้างแล้ว
echo.

REM ขั้นตอน 2: เพิ่มไฟล์
echo ⏳ ขั้นตอนที่ 2: เพิ่มไฟล์ทั้งหมด...
git add .
echo ✅ ไฟล์ทั้งหมดเพิ่มแล้ว
echo.

REM ขั้นตอน 3: Commit
echo ⏳ ขั้นตอนที่ 3: สร้าง commit...
git commit -m "%COMMIT_MSG%"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Commit ไม่สำเร็จ
    pause
    exit /b 1
)
echo ✅ Commit สำเร็จ
echo.

REM ขั้นตอน 4: เปลี่ยนชื่อ branch
echo ⏳ ขั้นตอนที่ 4: เปลี่ยนชื่อ branch เป็น %BRANCH_NAME%...
git branch -M %BRANCH_NAME%
echo ✅ Branch เปลี่ยนแล้ว
echo.

REM ขั้นตอน 5: เพิ่ม remote
echo ⏳ ขั้นตอนที่ 5: เพิ่ม GitHub remote...
git remote add origin %REPO_URL%
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ไม่สามารถเพิ่ม remote
    pause
    exit /b 1
)
echo ✅ Remote เพิ่มแล้ว
echo.

REM ขั้นตอน 6: Push
echo ⏳ ขั้นตอนที่ 6: อัพโหลดไปยัง GitHub (อาจต้องใส่ credentials)...
git push -u origin %BRANCH_NAME%
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ อัพโหลดไม่สำเร็จ
    echo    ตรวจสอบ:
    echo    1. URL ถูกต้อง
    echo    2. คุณมีสิทธิ์เข้าถึง repository
    echo    3. Git credentials ถูกต้อง
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════
echo   ✅ อัพโหลดสำเร็จ!
echo ════════════════════════════════════════════════
echo.
echo 📍 Repository URL: %REPO_URL%
echo 🌿 Branch: %BRANCH_NAME%
echo.
echo 👉 ไปที่ GitHub เพื่อตรวจสอบ: %REPO_URL%
echo.
pause
