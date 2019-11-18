@echo off

set appName=XenoApp
set appLink="https://xeno.app/users/sign_in"

echo Processing...

:: nativefy the app and copy the assets in the app folder
cmd /C nativefier --name %appName% --icon assets\xenoicon.ico --internal-urls ".*?" %appLink% || goto :error
xcopy /E /I "assets" "%appName%-win32-x64\assets\"

:: post nativefy infos
echo.
echo [92mInstallation finished.[0m
echo [96mNow go in XenoApp-win32-x64\resources\app\lib\mains.js and add[0m
echo [96m_electron.app.setAppUserModelId("%appName%") at line 133[0m
echo [96m(it should be under electronSquirrelStartup declaration)[0m

pause

:error
exit /b %errorlevel%
pause