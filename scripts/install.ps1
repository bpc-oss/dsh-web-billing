# dsh-web-billing install helper: link this package into a dsh profile as a
# junction so the running `dsh web` can resolve it, without copying files.
#
# Usage:
#   powershell -ExecutionPolicy Bypass -File scripts/install.ps1 [-Profile web] [-DshHome <path>]
#
# Notes:
# - Creates $DshHome/profiles/<Profile>/node_modules/dsh-web-billing as a
#   junction pointing at this repository, and appends the package to the
#   profile's `dsh.profile.bundles` (its cordis.patch.yml then supplies the
#   plugin row). For distributed installs prefer the official route:
#   `dsh plugin --profile <name> add github:<owner>/dsh-web-billing`.

param(
    [string]$Profile = "web",
    [string]$DshHome = ""
)

$ErrorActionPreference = "Stop"

if ($DshHome -eq "") {
    $DshHome = if ($env:DSH_HOME -and $env:DSH_HOME.Trim() -ne "") { $env:DSH_HOME } else { Join-Path $HOME ".dsh" }
}
$repoRoot = Split-Path -Parent $PSScriptRoot
$linkDir = Join-Path $DshHome "profiles\$Profile\node_modules"
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

# Register the bundle layer so its cordis.patch.yml supplies the plugin row.
$manifestPath = Join-Path $DshHome "profiles\$Profile\package.json"
if (Test-Path $manifestPath) {
    $manifest = Get-Content $manifestPath -Raw | ConvertFrom-Json
    $bundles = @($manifest.dsh.profile.bundles)
    if ($bundles -notcontains "dsh-web-billing") {
        $manifest.dsh.profile.bundles = @($bundles + "dsh-web-billing")
        $manifest | ConvertTo-Json -Depth 10 | Set-Content $manifestPath -Encoding utf8
        Write-Host "Added dsh-web-billing to dsh.profile.bundles in $manifestPath"
    }
} else {
    Write-Host "WARNING: $manifestPath not found; add 'dsh-web-billing' to dsh.profile.bundles manually."
}

Write-Host "Done. Restart 'dsh web' to activate."
