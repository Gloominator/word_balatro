param(
    [string]$Python = "python",
    [string]$SpaCyModel = "en_core_web_lg",
    [switch]$Console,
    [switch]$Rebuild
)

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$forward = @{
    Python     = $Python
    SpaCyModel = $SpaCyModel
    Rebuild    = $Rebuild
}
if ($Console) {
    $forward.Console = $true
}
& (Join-Path $here "package_windows_en.ps1") @forward
