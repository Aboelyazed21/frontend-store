const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

// زيادة الحدود المسموحة لاستيعاب صور Base64 المرفوعة من الجهاز
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// الاتصال بقاعدة البيانات (يدعم الاتصال المحلي والسحابي عبر متغيرات البيئة)
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sh2004Aa@#', 
    database: process.env.DB_NAME || 'clothing_store',
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Database connected successfully!');
});

// 1. API جلب المنتجات
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            return res.json(results);
        }
    });
});

// 1.1 API إضافة منتج جديد مع دعم رفع الصور من الجهاز والفئة
app.post('/api/products', (req, res) => {
    const { title, description, price, stock_quantity, images, category } = req.body;
    const query = 'INSERT INTO products (title, description, price, stock_quantity, images, category) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [title, description, price, stock_quantity, images || '', category || 'ملابس'], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'تم إضافة المنتج بنجاح', productId: result.insertId });
    });
});

// 1.2 API حذف منتج
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM products WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json({ message: 'تم حذف المنتج بنجاح' });
    });
});

// 2. API إنشاء حساب جديد مع حفظ التليفون والعنوان
app.post('/api/register', async (req, res) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, "user")';
        db.query(query, [name, email, hashedPassword, phone || 'غير مسجل', address || 'غير مسجل'], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'البريد الإلكتروني مستخدم مسبقاً' });
                }
                return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({ message: 'تم إنشاء الحساب بنجاح!' });
        });
    } catch (err) {
        return res.status(500).json({ error: 'حدث خطأ في الخادم' });
    }
});

// 2.1 API جلب جميع المستخدمين
app.get('/api/users', (req, res) => {
    const query = 'SELECT id, name, email, phone, address FROM users';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(results);
    });
});

// 3. API تسجيل الدخول
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (email === 'aboelyazed@gmail.com' && password === 'sh2004Aa') {
        return res.json({ 
            message: 'تم تسجيل دخول الأدمن بنجاح', 
            user: { id: 0, name: 'Aboelyazzed Hatem', email: 'aboelyazed@gmail.com', role: 'admin' } 
        });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'المستخدم غير موجود' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'كلمة المرور غير صحيحة' });

        return res.json({ 
            message: 'تم تسجيل الدخول بنجاح', 
            user: { id: user.id, name: user.name, email: user.email, role: 'user' } 
        });
    });
});

// 4. API حفظ الطلبات مع طريقة الدفع
app.post('/api/orders', (req, res) => {
    const { userId, totalAmount, shippingAddress, phone, paymentMethod } = req.body;

    const query = `
        INSERT INTO orders
        (customer_id, total_amount, shipping_address, phone, payment_method, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'قيد المعالجة', NOW())
    `;

    db.query(
        query,
        [userId || null, totalAmount, shippingAddress || 'القاهرة، مصر', phone || 'غير متوفر', paymentMethod || 'الدفع عند الاستلام'],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.status(201).json({
                message: 'تم حفظ الطلب بنجاح ✅',
                orderId: result.insertId
            });
        }
    );
});

// 4.1 API جلب جميع الطلبات للداش بورد
app.get('/api/orders', (req, res) => {
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.json(results);
    });
});

// 4.2 API جلب طلبات مستخدم معين لمتابعتها في المتجر
app.get('/api/orders/user/:userId', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC';
    db.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(results);
    });
});

// 4.3 API تحديث حالة الطلب
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const query = 'UPDATE orders SET status = ? WHERE id = ?';
    
    db.query(query, [status, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
    });
});

// 4.4 API حذف طلب من لوحة التحكم
app.delete('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM orders WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: 'تم حذف الطلب بنجاح' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});