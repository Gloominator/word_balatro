param(
    [string]$Python = "python",
    [string]$SpaCyModel = "ru_core_news_lg",
    [switch]$Console,
    [switch]$Rebuild
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReleaseDir = Join-Path $ProjectRoot "release"
$DistDir = Join-Path $ProjectRoot "dist\KingMinusMan-RU"
$ReleaseAppDir = Join-Path $ReleaseDir "KingMinusMan-RU"

Push-Location $ProjectRoot
try {
    if ($Rebuild -or -not (Test-Path $DistDir)) {
        $BuildArgs = @{
            Python     = $Python
            SpaCyModel = $SpaCyModel
        }

        if (-not $Console) {
            $BuildArgs.Windowed = $true
        }

        & ".\build_windows_ru.ps1" @BuildArgs
    } else {
        Write-Host "Reusing existing build from .\dist\KingMinusMan-RU"
    }

    if (Test-Path $ReleaseDir) {
        Remove-Item $ReleaseDir -Recurse -Force
    }

    New-Item -ItemType Directory -Path $ReleaseAppDir -Force | Out-Null

    Copy-Item -Path "$DistDir\*" -Destination $ReleaseAppDir -Recurse -Force

    Write-Host ""
    Write-Host "Package staging complete (Russian)."
    Write-Host "Share folder: $ReleaseAppDir"
    Write-Host "Users can run KingMinusMan-RU.exe from that folder without installing Python or spaCy."
} finally {
    Pop-Location
}
