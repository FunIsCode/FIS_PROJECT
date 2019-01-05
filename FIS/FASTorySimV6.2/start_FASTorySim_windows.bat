@echo off

IF EXIST "node_modules" (
    ECHO "node-modules are found"
    ECHO "Starting the simulator . . ."
    node bin/www
) ELSE (
    ECHO "node-modules not found"
    ECHO "installing node modules . . ."
    npm install
    ECHO "Starting the simulator . . ."
    node bin/www
)
pause