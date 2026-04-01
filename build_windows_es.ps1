param(
    [string]$Python = "python",
    [string]$SpaCyModel = "es_core_news_lg",
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
$SoundtrackPath = Join-Path $ProjectRoot "sounds\music\soundtrack.mp3"
if (-not (Test-Path $SoundtrackPath)) {
    throw "Background music not found (required for EXE): $SoundtrackPath"
}

$DeckPath = Join-Path $ProjectRoot "deck.json"
$DeckEsPath = Join-Path $ProjectRoot "deck.es.json"
$DeckBackup = Join-Path $ProjectRoot "deck.json.bak_build"

if (-not (Test-Path $DeckEsPath)) {
    throw "Spanish deck not found: $DeckEsPath"
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
    "spanishmostcommon.json",
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
    Copy-Item $DeckEsPath $DeckPath -Force

    Write-Host "Using Python $PythonVersion (Spanish / $SpaCyModel)"
    Write-Host "Installing build dependencies..."
    & $Python -m pip install --disable-pip-version-check -r requirements.txt pyinstaller

    Write-Host "Ensuring spaCy model '$SpaCyModel' is installed..."
    & $Python -m spacy download $SpaCyModel

    Write-Host "Ensuring NLTK WordNet + OMW (bundled for offline EXE)..."
    $NltkPy = @'
import nltk
from pathlib import Path
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)
p = next((Path(r).resolve() for r in nltk.data.path if (Path(r) / 'corpora' / 'wordnet.zip').is_file()), None)
assert p
print(p)
'@
    $NltkDataRoot = (& $Python -c $NltkPy).Trim()
    if (-not (Test-Path $NltkDataRoot)) {
        throw "Could not locate NLTK data root after corpus download: $NltkDataRoot"
    }

    $PyInstallerArgs = @(
        "-m", "PyInstaller",
        "--noconfirm",
        "--clean",
        "--name", "KingMinusMan-ES",
        "--onedir",
        "--collect-all", "spacy",
        "--collect-all", "wordfreq",
        "--collect-all", "nltk",
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
    $PyInstallerArgs += @("--add-data", "assets;assets")
    $PyInstallerArgs += @("--add-data", "${NltkDataRoot};nltk_data")

    if (-not (Test-Path $WordfreqDataSource)) {
        throw "Could not locate wordfreq data directory: $WordfreqDataSource"
    }

    $PyInstallerArgs += @("--add-data", "$WordfreqDataSource;wordfreq/data")

    $PyInstallerArgs += "wordmath.py"

    Write-Host "Building Windows executable (Spanish)..."
    & $Python @PyInstallerArgs

    Write-Host ""
    Write-Host "Build complete."
    Write-Host "Run: .\dist\KingMinusMan-ES\KingMinusMan-ES.exe"
} finally {
    if ($DeckBackedUp -and (Test-Path $DeckBackup)) {
        Move-Item $DeckBackup $DeckPath -Force
    } elseif ($DeckWasMissing -and (Test-Path $DeckPath)) {
        Remove-Item $DeckPath -Force
    }
    Pop-Location
}
