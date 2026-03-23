$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:WORDMATH_GAME_LOCALE = "en"
Remove-Item Env:WORDMATH_SPACY_MODEL -ErrorAction SilentlyContinue
& python wordmath.py $args
