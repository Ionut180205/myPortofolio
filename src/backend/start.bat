@echo off
echo Starting the project...

:: Run the npm dev script
echo Running npm dev...
npm run --prefix "C:\ReactProject\proiect-individual" dev

:: Run the Python backend
echo Running Python backend...
python "C:\ReactProject\proiect-individual\src\backend\main.py"

:: Run the Node.js backend
echo Running Node.js backend...
node "C:\ReactProject\proiect-individual\src\backend\server.js"

echo All processes started!
pause
