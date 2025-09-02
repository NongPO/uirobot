# 🚀 Supabase Setup Guide สำหรับ Robot Control System

## 📋 ขั้นตอนการติดตั้ง Supabase

### 1. สร้าง Supabase Project

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. คลิก **"New Project"**
3. เลือก Organization หรือสร้างใหม่
4. กรอกข้อมูล:
   - **Name**: `robot-control-system`
   - **Database Password**: สร้างรหัสผ่านที่แข็งแกร่ง
   - **Region**: เลือกใกล้ที่สุด (แนะนำ Southeast Asia)
5. คลิก **"Create new project"**
6. รอสักครู่จนโปรเจคพร้อมใช้งาน

### 2. ตั้งค่า Database Schema

1. ในโปรเจค Supabase ไปที่ **SQL Editor**
2. คลิก **"New query"**
3. คัดลอกโค้ด SQL จากไฟล์ `database/schema.sql`
4. วางใน SQL Editor และกด **"Run"**
5. ตรวจสอบว่าตารางถูกสร้างสำเร็จใน **Table Editor**

### 3. ตั้งค่า Environment Variables

1. ในโปรเจค Supabase ไปที่ **Settings** > **API**
2. คัดลอก:
   - **Project URL** (URL)
   - **anon public** key (API Key)

3. อัปเดตไฟล์ `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ แทนที่ค่าด้านบนด้วยค่าจริงจากโปรเจคของคุณ**

### 4. ตั้งค่า Authentication

1. ในโปรเจค Supabase ไปที่ **Authentication** > **Settings**
2. ใน **Site URL** ใส่: `http://localhost:3000`
3. ใน **Redirect URLs** เพิ่ม:
   - `http://localhost:3000`
   - `http://localhost:3000/auth/callback`

### 5. เปิดใช้งาน Realtime (สำหรับ real-time updates)

1. ไปที่ **Database** > **Replication**
2. เปิดใช้งาน realtime สำหรับตาราง:
   - `robot_status`
   - `alerts`
   - `analytics_data`

## 🧪 การทดสอบ

### 1. ทดสอบการเชื่อมต่อ

```bash
npm run dev
```

### 2. ทดสอบการสมัครสมาชิก

1. เปิด http://localhost:3000
2. คลิก "สมัครสมาชิก"
3. กรอกข้อมูลและลองสมัคร
4. ตรวจสอบใน Supabase Dashboard > **Authentication** > **Users**

### 3. ทดสอบการเข้าสู่ระบบ

1. ใช้อีเมลและรหัสผ่านที่สมัครไว้
2. เข้าสู่ระบบ
3. ควรเข้าสู่หน้า Dashboard ได้

## 📊 ตัวอย่างข้อมูลทดสอบ

หลังจากมีผู้ใช้แล้ว สามารถเพิ่มข้อมูลทดสอบ:

```sql
-- เพิ่มหุ่นยนต์ทดสอบ (แทนที่ 'user-id' ด้วย ID จริง)
INSERT INTO public.robots (user_id, name, type, location, status) VALUES
('user-id-here', 'Robot Alpha', 'delivery', 'อาคาร A ชั้น 1', 'online'),
('user-id-here', 'Robot Beta', 'security', 'อาคาร A ชั้น 2', 'online'),
('user-id-here', 'Robot Gamma', 'cleaning', 'อาคาร B ชั้น 1', 'maintenance');

-- เพิ่มสถานะหุ่นยนต์
INSERT INTO public.robot_status (robot_id, battery_level, temperature, network_quality, cpu_usage, memory_usage) VALUES
('robot-id-here', 85, 42.5, 88, 25.5, 64.2);

-- เพิ่มการแจ้งเตือน
INSERT INTO public.alerts (robot_id, user_id, type, title, message, priority) VALUES
('robot-id-here', 'user-id-here', 'warning', 'แบตเตอรี่ต่ำ', 'แบตเตอรี่เหลือ 15%', 'high'),
('robot-id-here', 'user-id-here', 'info', 'งานเสร็จสิ้น', 'ทำความสะอาดเสร็จสิ้นแล้ว', 'medium');
```

## 🔧 การแก้ไขปัญหา

### ปัญหาที่พบบ่อย:

1. **"Invalid API key"**
   - ตรวจสอบ `.env.local` ว่าคีย์ถูกต้อง
   - Restart development server

2. **"Row Level Security violation"**
   - ตรวจสอบ RLS policies ใน database
   - ตรวจสอบว่าผู้ใช้ล็อกอินแล้ว

3. **"Cannot connect to database"**
   - ตรวจสอบ Supabase project URL
   - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต

### การดู Logs:

- **Authentication logs**: Supabase Dashboard > **Logs** > **Auth**
- **Database logs**: Supabase Dashboard > **Logs** > **Database**
- **Realtime logs**: Supabase Dashboard > **Logs** > **Realtime**

## 🚀 Production Setup

เมื่อพร้อม deploy:

1. อัปเดต **Site URL** และ **Redirect URLs** ในการตั้งค่า Auth
2. อัปเดต environment variables ใน production
3. ตั้งค่า custom domain (optional)
4. เปิดใช้งาน backup scheduling

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

---

**🎉 เสร็จแล้ว! ตอนนี้คุณพร้อมใช้งานระบบ Login และ Database แล้ว**
