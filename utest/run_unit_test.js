#!/cygdrive/c/USERS/_my_work/workspace/js-shell/build/bin/js -debug


var file_lib = __import__('File', null, {})
var ut = __import__('UnitTest', null, {})
print('Suite Root:' + (new file_lib.File('.')).abs_path())

ut.run_suite('.')