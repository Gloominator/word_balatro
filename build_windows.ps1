param(
    [string]$Python = "python",
    [string]$SpaCyModel = "en_core_web_lg",
    [switch]$Windowed
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonVersion = (& $Python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')").Trim()

if ($PythonVersion -notin @("3.11", "3.12")) {
    throw "Unsupported Python version $PythonVersion. Use Python 3.11 or 3.12 for this build."
}

$StaticFiles = @(
    "wordmath.html",
    "wordmath_app.js",
    "wordmath_styles.css",
    "deck.json",
    "category_pool.json",
    "index.html",
    "app.js",
    "engine.js",
    "hands.js",
    "styles.css"
)

Push-Location $ProjectRoot
try {
    Write-Host "Using Python $PythonVersion"
    Write-Host "Installing build dependencies..."
    & $Python -m pip install --disable-pip-version-check -r requirements.txt pyinstaller

    Write-Host "Ensuring spaCy model '$SpaCyModel' is installed..."
    & $Python -m spacy download $SpaCyModel

    $PyInstallerArgs = @(
        "-m", "PyInstaller",
        "--noconfirm",
        "--clean",
        "--name", "WordMath",
        "--onedir",
        "--collect-all", "spacy",
        "--collect-all", $SpaCyModel
    )

    if ($Windowed) {
        $PyInstallerArgs += "--windowed"
    } else {
        $PyInstallerArgs += "--console"
    }

    foreach ($file in $StaticFiles) {
        $PyInstallerArgs += @("--add-data", "$file;.")
    }

    $PyInstallerArgs += "wordmath.py"

    Write-Host "Building Windows executable..."
    & $Python @PyInstallerArgs

    Write-Host ""
    Write-Host "Build complete."
    Write-Host "Run: .\dist\WordMath\WordMath.exe"
} finally {
    Pop-Location
}
