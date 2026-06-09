#!/bin/bash

# 🚀 Script สำหรับอัพโหลดระบบเอกสารพัสดุไปยัง GitHub
# ใช้สำหรับ macOS และ Linux

echo "════════════════════════════════════════════════"
echo "  ระบบเอกสารพัสดุโรงเรียน - GitHub Upload"
echo "════════════════════════════════════════════════"
echo ""

# ตรวจสอบว่า git ติดตั้งแล้วหรือไม่
if ! command -v git &> /dev/null; then
    echo "❌ Git ยังไม่ติดตั้ง"
    echo "   ติดตั้ง Git จาก https://git-scm.com/"
    exit 1
fi

echo "✅ Git ติดตั้งแล้ว"
echo ""

# สอบถามรายละเอียด
read -p "📝 GitHub Repository URL (เช่น https://github.com/username/school-procurement-system): " REPO_URL
read -p "💬 Commit message (เช่น Update: Add Garuda seal and summary table): " COMMIT_MSG

if [ -z "$REPO_URL" ] || [ -z "$COMMIT_MSG" ]; then
    echo "❌ ต้องกรอกทั้ง URL และ commit message"
    exit 1
fi

# สอบถามสาขา
read -p "🌿 Branch name (ค่าเริ่มต้น: main): " BRANCH_NAME
BRANCH_NAME=${BRANCH_NAME:-main}

echo ""
echo "════════════════════════════════════════════════"
echo "  เริ่มการอัพโหลด..."
echo "════════════════════════════════════════════════"
echo ""

# ขั้นตอน 1: ตั้งค่า git
echo "⏳ ขั้นตอนที่ 1: ตั้งค่า Git repository..."
git init
echo "✅ Git repository สร้างแล้ว"
echo ""

# ขั้นตอน 2: เพิ่มไฟล์
echo "⏳ ขั้นตอนที่ 2: เพิ่มไฟล์ทั้งหมด..."
git add .
echo "✅ ไฟล์ทั้งหมดเพิ่มแล้ว"
echo ""

# ขั้นตอน 3: Commit
echo "⏳ ขั้นตอนที่ 3: สร้าง commit..."
git commit -m "$COMMIT_MSG"
if [ $? -ne 0 ]; then
    echo "❌ Commit ไม่สำเร็จ"
    exit 1
fi
echo "✅ Commit สำเร็จ"
echo ""

# ขั้นตอน 4: เปลี่ยนชื่อ branch
echo "⏳ ขั้นตอนที่ 4: เปลี่ยนชื่อ branch เป็น $BRANCH_NAME..."
git branch -M $BRANCH_NAME
echo "✅ Branch เปลี่ยนแล้ว"
echo ""

# ขั้นตอน 5: เพิ่ม remote
echo "⏳ ขั้นตอนที่ 5: เพิ่ม GitHub remote..."
git remote add origin $REPO_URL
echo "✅ Remote เพิ่มแล้ว"
echo ""

# ขั้นตอน 6: Push
echo "⏳ ขั้นตอนที่ 6: อัพโหลดไปยัง GitHub (อาจต้องใส่ credentials)..."
git push -u origin $BRANCH_NAME
if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════════════"
    echo "  ✅ อัพโหลดสำเร็จ!"
    echo "════════════════════════════════════════════════"
    echo ""
    echo "📍 Repository URL: $REPO_URL"
    echo "🌿 Branch: $BRANCH_NAME"
    echo ""
    echo "👉 ไปที่ GitHub เพื่อตรวจสอบ: $REPO_URL"
    echo ""
else
    echo ""
    echo "❌ อัพโหลดไม่สำเร็จ"
    echo "   ตรวจสอบ:"
    echo "   1. URL ถูกต้อง"
    echo "   2. คุณมีสิทธิ์เข้าถึง repository"
    echo "   3. Git credentials ถูกต้อง"
    exit 1
fi
