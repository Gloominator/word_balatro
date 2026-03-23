$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:WORDMATH_GAME_LOCALE = "ru"
$env:WORDMATH_SPACY_MODEL = "ru_core_news_lg"
& python wordmath.py $args
