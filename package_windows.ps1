param(
    [string]$Python = "python",
    [string]$SpaCyModel = "ru_core_news_lg",
    [switch]$Console,
    [switch]$Rebuild
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReleaseDir = Join-Path $ProjectRoot "release"
$DistDir = Join-Path $ProjectRoot "dist\WordMath"
$ReleaseAppDir = Join-Path $ReleaseDir "WordMath-windows"

Push-Location $ProjectRoot
try {
    if ($Rebuild -or -not (Test-Path $DistDir)) {
        $BuildArgs = @{
            Python = $Python
            SpaCyModel = $SpaCyModel
        }

        if (-not $Console) {
            $BuildArgs.Windowed = $true
        }

        & ".\build_windows.ps1" @BuildArgs
    } else {
        Write-Host "Reusing existing build from .\dist\WordMath"
    }

    if (Test-Path $ReleaseDir) {
        Remove-Item $ReleaseDir -Recurse -Force
    }

    New-Item -ItemType Directory -Path $ReleaseAppDir -Force | Out-Null

    Copy-Item -Path "$DistDir\*" -Destination $ReleaseAppDir -Recurse -Force

    Write-Host ""
    Write-Host "Package staging complete."
    Write-Host "Share folder: $ReleaseAppDir"
    Write-Host "Users can run WordMath.exe from that folder without installing Python or spaCy."
} finally {
    Pop-Location
}
