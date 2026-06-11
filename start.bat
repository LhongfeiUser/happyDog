@echo off
echo 🐾 宠物服务平台启动脚本
echo ========================
echo.

echo 📦 启动后端服务...
start "Pet Service Server" cmd /k "cd server && npm start"

echo ⏳ 等待后端服务启动...
timeout /t 3 /nobreak >nul

echo 🚀 启动前端服务...
start "Pet Service Client" cmd /k "npm run dev"

echo.
echo ✅ 启动完成！
echo 📡 后端地址: http://localhost:3000
echo 🌐 前端地址: http://localhost:5173
echo.
echo 测试账号: 13800138000 / 123456
echo.
pause
