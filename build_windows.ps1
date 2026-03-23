param(
    [string]$Python = "python",
    [string]$SpaCyModel = "en_core_web_lg",
    [switch]$Windowed
)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$argsHash = @{
    Python     = $Python
    SpaCyModel = $SpaCyModel
}
if ($Windowed) {
    $argsHash.Windowed = $true
}
& (Join-Path $here "build_windows_en.ps1") @argsHash
