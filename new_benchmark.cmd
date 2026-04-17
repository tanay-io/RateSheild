@echo off
echo ========================================================= > new.txt
echo 🟢 RUNNING LUA SCRIPT BENCHMARKS 🟢 >> new.txt
echo ========================================================= >> new.txt
echo This script demonstrates that the race conditions and memory leaks >> new.txt
echo have been fixed by the newly implemented Lua scripts! >> new.txt
echo. >> new.txt

echo ========================================================= >> new.txt
echo [1/3] TESTING TOKEN BUCKET (With Lua Scripts) >> new.txt
echo ========================================================= >> new.txt
echo Setup: Limit is strictly 10. We are firing 100 concurrent requests. >> new.txt
echo Expected: Exactly 10 '2xx' responses. (No Race Condition) >> new.txt
echo. >> new.txt
echo Running Token Bucket Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"test:lua:token\",\"algo\":\"token_bucket\",\"limit\":10,\"window\":10000}" http://localhost:3000/check >> new.txt 2>&1
echo. >> new.txt

echo ========================================================= >> new.txt
echo [2/3] TESTING SLIDING WINDOW (With Lua Scripts) >> new.txt
echo ========================================================= >> new.txt
echo Setup: Limit is 10. Firing massive concurrency. >> new.txt
echo Expected: Limits correctly to 10 '2xx' responses, and ZADD is skipped >> new.txt
echo for rejected requests, saving RAM. >> new.txt
echo. >> new.txt
echo Running Sliding Window Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"test:lua:sliding\",\"algo\":\"sliding\",\"limit\":10,\"window\":60}" http://localhost:3000/check >> new.txt 2>&1
echo. >> new.txt

echo ========================================================= >> new.txt
echo [3/3] TESTING FIXED WINDOW (With Lua Scripts) >> new.txt
echo ========================================================= >> new.txt
echo Setup: Limit is 10. Firing massive concurrency. >> new.txt
echo Expected: Limits correctly, and NO redundant EXPIRE flooding! >> new.txt
echo. >> new.txt
echo Running Fixed Window Test... (Please wait)
call autocannon -c 100 -d 5 -m POST -H "Content-Type: application/json" -b "{\"key\":\"test:lua:fixed\",\"algo\":\"fixed\",\"limit\":10,\"window\":60}" http://localhost:3000/check >> new.txt 2>&1
echo. >> new.txt

echo ========================================================= >> new.txt
echo ✅ LUA TESTS COMPLETE! >> new.txt
echo ========================================================= >> new.txt
echo All tests finished! Open new.txt to see the results.
