@echo off
set /a index = 0
setlocal enabledelayedexpansion
for /f %%i in ('dir /b') do (
   ren %%i !index!.webp
   set /a index += 1
)