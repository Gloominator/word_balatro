param(
    [string]$Python = "python",
    [string]$SpaCyModel = "en_core_web_lg",
    [switch]$Console,
    [switch]$Rebuild
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$ReleaseDir = Join-Path $ProjectRoot "release"
$ZipPath = Join-Path $ReleaseDir "WordMath-windows.zip"
$DistDir = Join-Path $ProjectRoot "dist\WordMath"

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

    New-Item -ItemType Directory -Path $ReleaseDir | Out-Null

    Compress-Archive -Path "$DistDir\*" -DestinationPath $ZipPath -Force

    Write-Host ""
    Write-Host "Package complete."
    Write-Host "Share: $ZipPath"
    Write-Host "Users can extract it and run WordMath.exe without installing Python or spaCy."
} finally {
    Pop-Location
}
