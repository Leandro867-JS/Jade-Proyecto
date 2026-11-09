@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>&1
if errorlevel 1 (
    echo No se encontro Python ^(comando "py"^).
    pause
    exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
    echo No se encontro Node.js.
    pause
    exit /b 1
)

echo [1/5] Entorno virtual...
if not exist venv\Scripts\python.exe (
    py -m venv venv
    if errorlevel 1 (
        echo No se pudo crear el entorno virtual.
        pause
        exit /b 1
    )
)

echo [2/5] Dependencias de Python...
venv\Scripts\python.exe -m pip install -r requirements.txt
if errorlevel 1 (
    echo Fallo la instalacion de dependencias de Python.
    pause
    exit /b 1
)

echo [3/5] Base de datos...
venv\Scripts\python.exe manage.py migrate

echo [4/5] Dependencias de React...
if not exist frontend\node_modules (
    pushd frontend
    call npm.cmd install
    popd
)

echo [5/5] Iniciando servidores...
start "Django" cmd /k venv\Scripts\python.exe manage.py runserver
start "React" /d frontend cmd /k npm.cmd run dev

timeout /t 8 >nul
start http://localhost:5173