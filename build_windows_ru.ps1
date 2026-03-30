param(
    [string]$Python = "python",
    [string]$SpaCyModel = "ru_core_news_lg",
    [switch]$Windowed
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonVersion = (& $Python -c "import sys; print(f'{sys.version_info.major}.{sys.version_info.minor}')").Trim()
$WordfreqDataSource = (& $Python -c "from pathlib import Path; import wordfreq.util; print(Path(wordfreq.util.data_path()).resolve())").Trim()

if ($PythonVersion -notin @("3.11", "3.12")) {
    throw "Unsupported Python version $PythonVersion. Use Python 3.11 or 3.12 for this build."
}

$FontsDir = Join-Path $ProjectRoot "fonts"
if (-not (Test-Path $FontsDir)) {
    throw "Fonts directory not found: $FontsDir"
}

$SoundsDir = Join-Path $ProjectRoot "sounds"
if (-not (Test-Path $SoundsDir)) {
    throw "Sounds directory not found: $SoundsDir"
}

$DeckPath = Join-Path $ProjectRoot "deck.json"
$DeckRuPath = Join-Path $ProjectRoot "deck.ru.json"
$DeckBackup = Join-Path $ProjectRoot "deck.json.bak_build"

if (-not (Test-Path $DeckRuPath)) {
    throw "Russian deck not found: $DeckRuPath"
}

$StaticFiles = @(
    "wordmath.html",
    "wordmath_app.js",
    "wordmath_locales.js",
    "wordmath_i18n.js",
    "wordmath_tutorial.js",
    "wordmath_sounds.js",
    "wordmath_styles.css",
    "deck.json",
    "category_pool.json",
    "russianmostcommon.json",
    "index.html",
    "app.js",
    "engine.js",
    "hands.js",
    "styles.css"
)

Push-Location $ProjectRoot
$DeckBackedUp = $false
$DeckWasMissing = -not (Test-Path $DeckPath)
try {
    if (Test-Path $DeckPath) {
        Copy-Item $DeckPath $DeckBackup -Force
        $DeckBackedUp = $true
    }
    Copy-Item $DeckRuPath $DeckPath -Force

    Write-Host "Using Python $PythonVersion (Russian / $SpaCyModel)"
    Write-Host "Installing build dependencies..."
    & $Python -m pip install --disable-pip-version-check -r requirements.txt pyinstaller

    Write-Host "Ensuring spaCy model '$SpaCyModel' is installed..."
    & $Python -m spacy download $SpaCyModel

    $PyInstallerArgs = @(
        "-m", "PyInstaller",
        "--noconfirm",
        "--clean",
        "--name", "WordMath-RU",
        "--onedir",
        "--collect-all", "spacy",
        "--collect-all", "wordfreq",
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

    $PyInstallerArgs += @("--add-data", "fonts;fonts")
    $PyInstallerArgs += @("--add-data", "sounds;sounds")

    if (-not (Test-Path $WordfreqDataSource)) {
        throw "Could not locate wordfreq data directory: $WordfreqDataSource"
    }

    $PyInstallerArgs += @("--add-data", "$WordfreqDataSource;wordfreq/data")

    $PyInstallerArgs += "wordmath.py"

    Write-Host "Building Windows executable (Russian)..."
    & $Python @PyInstallerArgs

    Write-Host ""
    Write-Host "Build complete."
    Write-Host "Run: .\dist\WordMath-RU\WordMath-RU.exe"
} finally {
    if ($DeckBackedUp -and (Test-Path $DeckBackup)) {
        Move-Item $DeckBackup $DeckPath -Force
    } elseif ($DeckWasMissing -and (Test-Path $DeckPath)) {
        Remove-Item $DeckPath -Force
    }
    Pop-Location
}
