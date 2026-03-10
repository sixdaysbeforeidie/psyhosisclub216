# Этот скрипт заменяет все .png на .webp в HTML файлах
# Запускай ПОСЛЕ того как сконвертировал картинки через ImageMagick

$files = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace '\.png"', '.webp"'
    $newContent = $newContent -replace "\.png'", ".webp'"
    Set-Content $file.FullName $newContent -Encoding UTF8
    Write-Host "Обновлён: $($file.Name)"
}

Write-Host ""
Write-Host "Готово! Все .png заменены на .webp"
Write-Host "Нажми любую клавишу..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
