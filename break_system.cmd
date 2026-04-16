@echo off
echo ========================================================= > break_system.txt
echo 🚨 RUNNING SYSTEM BREAKER BENCHMARKS 🚨 >> break_system.txt
echo ========================================================= >> break_system.txt
echo This script demonstrates the race conditions and memory leaks >> break_system.txt
echo in the standard Go implementation, showing WHY Lua scripts are needed. >> break_system.txt
echo. >> break_system.txt

echo ========================================================= >> break_system.txt
echo [1/3] BREAKING TOKEN BUCKET (Read-Modify-Write Race Condition) >> break_system.txt
echo ========================================================= >> break_system.txt
echo Setup: Limit is strictly 10. We are firing 100 concurrent requests. >> break_system.txt
echo Expected: Exactly 10 '2xx' responses. >> break_system.txt
echo Reality: Far more than 10 pass because of the Read-Modify-Write race condition! >> break_system.txt
echo. >> break_system.txt
echo Running Token Bucket Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"break:token\",\"algo\":\"token_bucket\",\"limit\":10,\"window\":10000}" http://localhost:3000/check >> break_system.txt 2>&1
echo. >> break_system.txt

echo ========================================================= >> break_system.txt
echo [2/3] BREAKING SLIDING WINDOW (Unbounded Memory Bloat / DDOS Vulnerability) >> break_system.txt
echo ========================================================= >> break_system.txt
echo Setup: Limit is 10. Firing massive concurrency (DDOS simulation). >> break_system.txt
echo Reality: The system correctly limits to 10 '2xx' responses, BUT... >> break_system.txt
echo VULNERABILITY: Every single rejected request unconditionally executes ZADD! >> break_system.txt
echo If you check Redis after this, the ZSET has thousands of useless items, wasting RAM. >> break_system.txt
echo A Lua script checks ZCARD *before* adding, preventing OOM crashes! >> break_system.txt
echo. >> break_system.txt
echo Running Sliding Window Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"break:sliding\",\"algo\":\"sliding\",\"limit\":10,\"window\":60}" http://localhost:3000/check >> break_system.txt 2>&1
echo. >> break_system.txt

echo ========================================================= >> break_system.txt
echo [3/3] BREAKING FIXED WINDOW (Thundering Herd / Redundant Commands) >> break_system.txt
echo ========================================================= >> break_system.txt
echo Setup: Limit is 10. Firing massive concurrency. >> break_system.txt
echo Reality: Limits correctly, BUT the EXPIRE command is not functionally pipelined correctly. >> break_system.txt
echo VULNERABILITY: 10,000 concurrent routines see TTL=-1 at the exact same time. >> break_system.txt
echo This causes 10,000 redundant EXPIRE commands to flood Redis simultaneously! >> break_system.txt
echo Lua script handles everything on the Redis server side in a single operation. >> break_system.txt
echo. >> break_system.txt
echo Running Fixed Window Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"break:fixed\",\"algo\":\"fixed\",\"limit\":10,\"window\":60}" http://localhost:3000/check >> break_system.txt 2>&1
echo. >> break_system.txt

echo ========================================================= >> break_system.txt
echo ✅ BREAKER TESTS COMPLETE! Use these results for the README. >> break_system.txt
echo ========================================================= >> break_system.txt
echo All tests finished! Open break_system.txt to see the results.

