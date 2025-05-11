const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // 引入 CORS 支持

const app = express();
const PORT = 3000;

// 启用 CORS 支持，解决跨域问题
app.use(cors());

// 配置 MySQL 数据库连接
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',        // 修改为您的 MySQL 用户名
    password: 'Lc@20040920', // 修改为您的 MySQL 密码
    database: 'store_management' // 确保数据库名正确
});

// 测试数据库连接
db.connect(err => {
    if (err) {
        console.error('数据库连接失败:', err);
    } else {
        console.log('成功连接到数据库');
    }
});

// API 路由：获取门店数据
app.get('/api/stores', (req, res) => {
    const query = 'SELECT id, brand, name AS store, revenue, longitude, latitude, address, `system`, isQingtian FROM stores';
    db.query(query, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            res.status(500).json({ error: '服务器错误', details: err.message });
        } else {
            // 格式化数据，确保 position 字段正确
            const formattedResults = results.map(store => ({
                id: store.id,
                brand: store.brand,
                store: store.store,
                revenue: store.revenue,
                position: [store.longitude, store.latitude], // 显式构造 position 数组
                address: store.address,
                system: store.system,
                isQingtian: store.isQingtian === 1
            }));
            res.json(formattedResults);
        }
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`后端服务器运行在 http://localhost:${PORT}`);
});