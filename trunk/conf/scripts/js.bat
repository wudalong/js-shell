@echo off
rem set JS_HOME=%~dp0
rem echo %JS_HOME%
set JS_HOME=%~dp0..
java -classpath %~dp0 -DJS_HOME=$JS_HOME JavaScript %*