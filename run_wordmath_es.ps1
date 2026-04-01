$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env:WORDMATH_GAME_LOCALE = "es"
$env:WORDMATH_SPACY_MODEL = "es_core_news_lg"
& python wordmath.py $args
