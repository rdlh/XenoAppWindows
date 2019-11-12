@echo off

set appName=XenoApp

echo Processing...

:: nativefy the app and copy the assets in the app folder
cmd /C nativefier --name %appName% --icon assets\xenoicon.ico --internal-urls ".*?" "https://xeno.app/users/sign_in" || goto :error
xcopy /E /I "assets" "%appName%-win32-x64\assets\"

:: post nativefy infos
echo.
echo Installation finished.
echo Now go in XenoApp-win32-x64\resources\app\lib\mains.js and add
echo _electron.app.setAppUserModelId("%appName%") at line 133
echo (it should be under electronSquirrelStartup declaration)

pause

:error
exit /b %errorlevel%