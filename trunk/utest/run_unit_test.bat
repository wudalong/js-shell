@echo off

rem ..\build\bin\js.bat run_unit_test.js
java -classpath ..\run-time-src;..\lib\js.jar;..\build\classes org.javascript.standalone.shell.Main -debug run_unit_test.js %*

