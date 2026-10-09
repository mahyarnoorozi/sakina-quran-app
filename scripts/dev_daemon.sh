#!/bin/bash
# دیمون مقاوم برای dev سرور سکینه — با setsid کاملاً از ترمینال جدا می‌شود
cd /home/z/my-project

# اگر قبلاً اجراست، نکش (idempotent)
if curl -s -o /dev/null -m 2 http://localhost:3000; then
  echo "already running"
  exit 0
fi

pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1

setsid nohup ./node_modules/.bin/next dev -p 3000 >> dev.log 2>&1 < /dev/null &

# منتظر آماده شدن
for i in $(seq 1 30); do
  sleep 2
  if curl -s -o /dev/null -m 2 -w "" http://localhost:3000; then
    echo "ready after $((i*2))s"
    exit 0
  fi
done
echo "FAILED to start"
exit 1
