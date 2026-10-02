# Turfirma — frontend (v0.3.1 backend bilan mos)

React + TypeScript + Vite + Tailwind + Framer Motion. Backend: FastAPI, `turfirma-loyiha-hujjati.pdf` ga mos.

## Ishga tushirish

```bash
npm install
copy .env.example .env   # Windows cmd (macOS/Linux: cp .env.example .env)
npm run dev
```

`.env` production backendga (`https://crm-backend-cyi9.onrender.com`) qarab sozlangan.

## Yangi — dizayn

- **Qorong'u/yorug' rejim** — yuqori o'ng burchakdagi tugma, tizim sozlamasiga mos avtomatik tanlanadi, tanlov saqlanadi.
- **Animatsiyalar** — sahifa o'tishlari, ro'yxatlar ketma-ket paydo bo'lishi, tugma bosilganda kichik "tap" effekti, daraja progress-bar animatsiyasi.
- Rang palitrasi: asosiy — moviy-feruza (`primary`), foyda — yashil, xarajat/jarima — qizg'ish, bonus/daraja — oltin, hamrohlik — binafsha.

## 5 ta rol, 5 ta panel

| Rol | Panel | Asosiy imkoniyatlar |
|---|---|---|
| `super_admin` | `/super-admin` | Istalgan rolda foydalanuvchi yaratish, daraja haqlarini (1-7) belgilash, barcha mijozlarning turlarini ko'rish, har mijoz bo'yicha daromad/foyda/platforma ulushi |
| `boss` | `/boss` | O'z adminlarini qo'shish, o'z turlarining narx/xarajat/foydasi, kunlik va oylik hisobot |
| `admin` | `/admin` | Tur yaratish (manzillar, turistlar, haydovchi, git — aniq yoki darajaga taklif), status boshqarish, haq to'lash, bonus/jarima kiritish |
| `guide` | `/guide/tours` | O'z turlari, ochiq takliflarni qabul qilish, hamrohlik (amaliyot), daraja progressi, daromad |
| `driver` | `/driver/tours` | O'z turlari, yo'nalish, daromad |

## Muhim: admin endi foydalanuvchi ro'yxatini ko'rmaydi

Yangi hujjatga ko'ra `admin` uchun git/haydovchi ro'yxatini olish endpointi yo'q — ularni biriktirish uchun `user_id` ni bilish kerak (masalan super_admin yoki boshliq orqali). Shu sababli tur yaratish/tafsilot sahifalarida git/haydovchi tanlash **dropdown emas, `user_id` raqamini qo'lda kiritish** orqali ishlaydi. Agar backendga keyinchalik `GET /admin/guides` yoki shunga o'xshash ro'yxat endpointi qo'shilsa, buni dropdown'ga almashtirish oson.

## Birinchi marta ishga tushirish (hujjatdagi "15-bo'lim A" oqimi)

1. Terminal: `python -m app.create_admin` orqali birinchi `super_admin` yaratiladi.
2. Super admin kirib, `/super-admin/users` orqali birinchi `boss` (komissiya foizi bilan) va kerakli `guide`/`driver`larni yaratadi.
3. Super admin `/super-admin/level-fees` da 1-7 daraja haqlarini belgilaydi.
4. Boshliq kirib, `/boss/admins` orqali o'ziga admin qo'shadi (yoki buni ham super admin qiladi).
5. Admin kirib, kundalik turlarni kiritishni boshlaydi.

## Papka tuzilishi

```
src/
  api/          axios klienti + har rol uchun so'rovlar (superAdmin, boss, adminTours, guide, driver, me)
  auth/         AuthContext, ProtectedRoute, RoleRoute, token saqlash
  theme/        ThemeContext — qorong'u/yorug' rejim
  layouts/      SuperAdminLayout, BossLayout, AdminLayout, MobileLayout (git/haydovchi)
  pages/        har bir rol uchun sahifalar (super-admin/, boss/, admin/, guide/, driver/, common/)
  components/   Spinner, StatCard, ThemeToggle, PageTransition, StaggerList
```

## Production'ga chiqarganda

Backendchi CORS'ni hozir `*` qilib qo'ygan — frontendni Vercel'ga chiqargach, chiqqan domenni (`https://xxx.vercel.app`) xabar bering, xavfsizlik uchun shu manzilga toraytiradi.
"# crm-fronetend" 
