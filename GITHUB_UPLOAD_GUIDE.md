# 📤 วิธีอัพโหลดไปยัง GitHub

## 🎯 บทนำ

คู่มือนี้จะช่วยให้คุณอัพโหลดระบบเอกสารพัสดุไปยัง GitHub repository ของคุณ

---

## 📋 สิ่งที่ต้องเตรียม

- ✅ Git ติดตั้งแล้ว (https://git-scm.com/)
- ✅ GitHub account (https://github.com/)
- ✅ Repository สร้างแล้ว (`school-procurement-system`)
- ✅ ไฟล์ทั้งหมดเตรียมพร้อมในโฟลเดอร์

---

## 🚀 วิธี 1: ใช้ Script อัตโนมัติ (ง่ายที่สุด)

### สำหรับ macOS และ Linux:

```bash
chmod +x git-upload.sh
./git-upload.sh
```

ตามด้วยการใส่:
- GitHub Repository URL
- Commit message
- Branch name (ค่าเริ่มต้น: main)

### สำหรับ Windows:

1. คลิกขวาที่ไฟล์ `git-upload.bat`
2. เลือก "Run as administrator" หรือ เปิด PowerShell/CMD
3. พิมพ์ไปยังโฟลเดอร์ที่มี `git-upload.bat`:
```bash
git-upload.bat
```
4. ตามด้วยการใส่ข้อมูลตามที่ขอ

---

## 🚀 วิธี 2: ใช้คำสั่ง Git แบบ Manual

### ขั้นตอน 1: เปิด Terminal/PowerShell
```bash
# macOS/Linux: เปิด Terminal
# Windows: เปิด PowerShell หรือ CMD
```

### ขั้นตอน 2: ไปที่โฟลเดอร์ของโครงการ
```bash
cd school-procurement-system
```

### ขั้นตอน 3: สร้าง Git repository
```bash
git init
```

### ขั้นตอน 4: เพิ่มไฟล์ทั้งหมด
```bash
git add .
```

### ขั้นตอน 5: สร้าง Commit แรก
```bash
git commit -m "Initial commit: School procurement system with Garuda seal and summary table"
```

### ขั้นตอน 6: เปลี่ยนชื่อ branch (หากต้องการ)
```bash
git branch -M main
```

### ขั้นตอน 7: เพิ่ม Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/school-procurement-system.git
```

💡 **แทนที่** `YOUR_USERNAME` ด้วยชื่อ GitHub ของคุณ

### ขั้นตอน 8: อัพโหลดไปยัง GitHub
```bash
git push -u origin main
```

🔐 **GitHub อาจขอ Authentication:**
- ถ้าใช้ HTTPS: ใส่ username และ personal access token
- ถ้าใช้ SSH: ต้องตั้งค่า SSH keys ก่อน

---

## 🔐 การตั้งค่า GitHub Credentials

### สำหรับ HTTPS (ง่ายกว่า):

#### Windows:
1. เปิด "Credential Manager" (Windows Credential Manager)
2. เลือก "Windows Credentials"
3. เพิ่ม credential ใหม่:
   - Internet or network address: `git:https://github.com`
   - Username: GitHub username
   - Password: Personal Access Token (ดูด้านล่าง)

#### macOS/Linux:
```bash
# ครั้งแรก Git จะขอใส่ credentials
# ใส่ username และ personal access token
```

### สร้าง Personal Access Token:

1. ไปที่ GitHub Settings: https://github.com/settings/tokens
2. คลิก "Generate new token"
3. เลือก scopes: `repo` (full control of private repositories)
4. คลิก "Generate token"
5. **คัดลอก token** (จะแสดงเพียงครั้งเดียว!)
6. ใช้ token เป็น password เมื่อ Git ขอ

### สำหรับ SSH (ปลอดภัยกว่า):

```bash
# สร้าง SSH key (หากยังไม่มี)
ssh-keygen -t ed25519 -C "your_email@example.com"

# เพิ่ม public key ไปยัง GitHub Settings > SSH Keys
```

---

## 📝 การตั้งค่า Git Config (ครั้งแรก)

```bash
# ตั้งค่าชื่อ
git config --global user.name "Your Name"

# ตั้งค่าอีเมล
git config --global user.email "your.email@example.com"
```

---

## ✅ ตรวจสอบการอัพโหลด

### 1. ที่ Terminal:
```bash
git log
git remote -v
git branch -a
```

### 2. ที่ GitHub:
1. ไปที่ https://github.com/YOUR_USERNAME/school-procurement-system
2. ตรวจสอบว่า:
   - ✅ ไฟล์ทั้งหมดปรากฏ
   - ✅ Commit message ถูกต้อง
   - ✅ Branch เป็น `main` (ค่าเริ่มต้อง)

---

## 🔄 อัพเดทหลังจากนี้

### อัพเดทไฟล์ที่มีอยู่:
```bash
git add .
git commit -m "Update: [description of changes]"
git push origin main
```

### ตัวอย่าง:
```bash
git add .
git commit -m "Update: Fix Garuda seal positioning"
git push origin main
```

---

## ❌ แก้ไขปัญหาทั่วไป

### ❌ ปัญหา: "Repository already exists"
```bash
# ลบ .git และลองใหม่
rm -rf .git
git init
```

### ❌ ปัญหา: "Permission denied (publickey)"
```bash
# ตั้งค่า SSH key ใหม่
ssh-keygen -t ed25519
# เพิ่ม public key ไปยัง GitHub
```

### ❌ ปัญหา: "fatal: remote origin already exists"
```bash
# ลบ remote เดิม
git remote remove origin

# เพิ่ม remote ใหม่
git remote add origin https://github.com/YOUR_USERNAME/school-procurement-system.git
```

### ❌ ปัญหา: "Please tell me who you are"
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### ❌ ปัญหา: Changes committed with wrong name
```bash
# แก้ไข commit ล่าสุด
git commit --amend --author="Correct Name <email@example.com>"
git push origin main --force-with-lease
```

---

## 🎯 Render.com จะดึงข้อมูลจาก GitHub

หลังอัพโหลดสำเร็จ:

1. ไปที่ https://render.com
2. เข้าสู่ระบบ
3. คลิก "New Web Service"
4. เลือก GitHub repository: `school-procurement-system`
5. Render จะอ่านค่าตั้งจาก `render.yaml` โดยอัตโนมัติ
6. คลิก "Create Web Service"
7. ⏳ รอประมาณ 10-15 นาที
8. ✅ เว็บไซต์พร้อมใช้งาน! 🎉

---

## 📚 ไฟล์ที่รวมอยู่

```
.
├── server.py                 # ไฟล์หลัก ✅
├── index.html               # หน้า HTML
├── app.js                   # ตรรมชาติ
├── styles.css               # การออกแบบ
├── images.jpg               # ตราครุฑ ⭐
├── requirements.txt         # ไลบรารี Python
├── runtime.txt              # เวอร์ชัน Python
├── Procfile                 # สำหรับ Render
├── render.yaml              # การตั้งค่า Render
├── .gitignore               # ไฟล์ที่ไม่อัพโหลด
├── git-upload.sh            # Script สำหรับ macOS/Linux
├── git-upload.bat           # Script สำหรับ Windows
├── README_UPDATED.md        # เอกสารหลัก
├── QUICK_START.md           # คู่มือเริ่มต้น
├── UPDATE_SUMMARY.md        # สรุปการแก้ไข
└── TECHNICAL_GUIDE.md       # คู่มือทางเทคนิค
```

---

## 🎉 ผลลัพธ์สุดท้าย

✅ Repository ของคุณจะมี:
- ✅ ไฟล์ทั้งหมดเตรียมพร้อม
- ✅ Git history สะอาด
- ✅ Ready for Render.com deployment
- ✅ ทุกคนสามารถเข้าถึงได้ (หากเป็น public)

---

## 📞 ความช่วยเหลือ

หากติดขัด:
1. ตรวจสอบ Git ติดตั้งแล้ว: `git --version`
2. ตรวจสอบ credentials: `git config --list`
3. อ่าน GitHub Docs: https://docs.github.com/
4. ลองใช้ GitHub Desktop แทน (GUI ง่ายกว่า)

---

**สำเร็จแล้ว! ระบบของคุณอยู่บน GitHub แล้ว 🚀**
