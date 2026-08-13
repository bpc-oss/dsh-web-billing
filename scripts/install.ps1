# dsh-web-billing install helper: link this package into a dsh profile as a
# junction so the running `dsh web` can resolve it, without copying files.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/install.ps1 [-Profile web] [-DshHome <path>]
#
# Notes:
# - Creates $DshHome/profiles/<Profile>/node_modules/@dsh-local/dsh-web-billing
#   as a junction pointing at this repository.
# - Then enable the plugin in $DshHome/profiles/<Profile>/cordis.patch.yml:
#   add an `insert` row `{ id: web-billing, name: '@dsh-local/dsh-web-billing' }`
#   (see README.md) and restart `dsh web`.

param(
    [string]$Profile = "web",
    [string]$DshHome = ""
)

$ErrorActionPreference = "Stop"

if ($DshHome -eq "") {
    $DshHome = if ($env:DSH_HOME -and $env:DSH_HOME.Trim() -ne "") { $env:DSH_HOME } else { Join-Path $HOME ".dsh" }
}
$repoRoot = Split-Path -Parent $PSScriptRoot
$linkDir = Join-Path $DshHome "profiles\$Profile\node_modules\@dsh-local"
$link = Join-Path $linkDir "dsh-web-billing"

New-Item -ItemType Directory -Force -Path $linkDir | Out-Null
if (Test-Path $link) {
    $item = Get-Item $link -Force
    if ($item.LinkType -eq "Junction" -or $item.LinkType -eq "SymbolicLink") {
        Write-Host "Replacing existing link: $link"
        Remove-Item $link -Force
    } else {
        Write-Host "ERROR: $link exists and is not a link; remove it manually first."
        exit 1
    }
}
New-Item -ItemType Junction -Path $link -Target $repoRoot | Out-Null
Write-Host "Linked: $link -> $repoRoot"
Write-Host "Next steps:"
Write-Host "  1. Add the plugin row to $DshHome\profiles\$Profile\cordis.patch.yml:"
Write-Host "     - insert:"
Write-Host "         - id: web-billing"
Write-Host "           name: '@dsh-local/dsh-web-billing'"
Write-Host "  2. Restart 'dsh web'."
