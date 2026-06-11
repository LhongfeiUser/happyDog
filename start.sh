#!/bin/bash

echo "🐾 宠物服务平台启动脚本"
echo "========================"
echo ""

# 启动后端服务
echo "📦 启动后端服务..."
cd server
npm start &
SERVER_PID=$!
cd ..

# 等待后端服务启动
echo "⏳ 等待后端服务启动..."
sleep 3

# 启动前端服务
echo "🚀 启动前端服务..."
npm run dev &
CLIENT_PID=$!

echo ""
echo "✅ 启动完成！"
echo "📡 后端地址: http://localhost:3000"
echo "🌐 前端地址: http://localhost:5173"
echo ""
echo "测试账号: 13800138000 / 123456"
echo ""
echo "按 Ctrl+C 停止服务"

# 捕获退出信号
trap "kill $SERVER_PID $CLIENT_PID; exit" INT TERM

# 等待
wait
