# PowerShell script to fix Expo 53 TurboModuleRegistry error
# Run this in PowerShell: .\fix-expo-error.ps1

Write-Host "Cleaning up old dependencies..." -ForegroundColor Yellow

# Remove node_modules and lock files
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Removed node_modules" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ Removed package-lock.json" -ForegroundColor Green
}

if (Test-Path "yarn.lock") {
    Remove-Item -Force "yarn.lock"
    Write-Host "✓ Removed yarn.lock" -ForegroundColor Green
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`nFixing Expo dependencies to ensure compatibility..." -ForegroundColor Yellow
npx expo install --fix

Write-Host "`n✓ Done! Now run: npm start" -ForegroundColor Green
Write-Host "Or: npx expo start --clear" -ForegroundColor Green
