@echo off
title Compiling and pushing to screeps plus server
cd "D:\User Data\Michael\Documents\Visual Studio 2017\Projects\cashew\cashew"
call rollup -c --dest plus
if %ERRORLEVEL% NEQ 0 (
    ECHO Exit code: %ERRORLEVEL%
    pause
)

