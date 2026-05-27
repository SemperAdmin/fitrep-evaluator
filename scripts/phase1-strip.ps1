# =============================================================================
# FITREP Evaluator - Phase 1 Strip Script
# =============================================================================
# Purpose: Remove all unauthorized modules, workflows, server code, and synthetic
#          test data per the PoC Charter Memo dated [INSERT DATE].
#
# DO NOT RUN until the following are complete:
#   1. Current state is committed and tagged as preserve/pre-poc-realignment.
#   2. PoC-CHARTER.md is signed.
#   3. You have read this entire script and understand every block.
#
# Run from PowerShell at the project root:
#   cd D:\Coding\Fitness-Report-Evaluator
#   .\scripts\phase1-strip.ps1
#
# To preview without deleting:
#   .\scripts\phase1-strip.ps1 -DryRun
# =============================================================================

param(
    [switch]$DryRun = $false,
    [switch]$Force = $false
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host " FITREP EVALUATOR - PHASE 1 STRIP" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Project root: $projectRoot"
Write-Host "DryRun mode:  $DryRun"
Write-Host ""

if (-not $Force -and -not $DryRun) {
    Write-Host "This script will permanently delete server code, GitHub workflows, " -ForegroundColor Red
    Write-Host "synthetic test data, cloud integration modules, profile and admin " -ForegroundColor Red
    Write-Host "subsystems, and Render deployment scripts." -ForegroundColor Red
    Write-Host ""
    $confirm = Read-Host "Type DELETE to proceed, anything else to abort"
    if ($confirm -ne "DELETE") {
        Write-Host "Aborted by user." -ForegroundColor Yellow
        exit 0
    }
}

function Remove-Target {
    param([string]$Path, [string]$Reason)
    $full = Join-Path $projectRoot $Path
    if (Test-Path $full) {
        if ($DryRun) {
            Write-Host "[DRY] Would remove: $Path  ($Reason)" -ForegroundColor Cyan
        } else {
            Remove-Item -Path $full -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "[REM] Removed:      $Path  ($Reason)" -ForegroundColor Green
        }
    } else {
        Write-Host "[SKIP] Not present: $Path" -ForegroundColor DarkGray
    }
}

# --- 1. Server-side runtime ----------------------------------------------------
Remove-Target -Path "server"               -Reason "Express server, Supabase, Redis, jobs"
Remove-Target -Path "server-example.js"    -Reason "GitHub proxy reference implementation"
Remove-Target -Path "check_supabase.js"    -Reason "Supabase debug script"
Remove-Target -Path "test_api.js"          -Reason "Backend API smoke test"

# --- 2. Admin surface ----------------------------------------------------------
Remove-Target -Path "admin.html"           -Reason "Admin dashboard entry point"
Remove-Target -Path "js\admin"             -Reason "Admin module directory"

# --- 3. GitHub Actions workflows -----------------------------------------------
Remove-Target -Path ".github\workflows\create-user.yml"     -Reason "User profile creation workflow"
Remove-Target -Path ".github\workflows\save-evaluation.yml" -Reason "Evaluation YAML persistence"
Remove-Target -Path ".github\workflows\save-user-data.yml"  -Reason "User profile persistence"

# --- 4. Cloud and external integration JS modules ------------------------------
Remove-Target -Path "js\backend-api.js"          -Reason "Backend API client"
Remove-Target -Path "js\github-api.js"           -Reason "Direct GitHub API client"
Remove-Target -Path "js\githubHelpers.js"        -Reason "GitHub helper utilities"
Remove-Target -Path "js\githubService.js"        -Reason "GitHub service layer"
Remove-Target -Path "js\githubServiceCached.js"  -Reason "GitHub caching service"
Remove-Target -Path "js\idbStore.js"             -Reason "IndexedDB persistence"
Remove-Target -Path "js\persistence.js"          -Reason "localStorage persistence"
Remove-Target -Path "js\profile.js"              -Reason "Profile and auth module"
Remove-Target -Path "js\networkCache.js"         -Reason "Network response cache"
Remove-Target -Path "js\storageCore.js"          -Reason "Storage abstraction core"
Remove-Target -Path "js\storageHelpers.js"       -Reason "Storage helper utilities"
Remove-Target -Path "js\unifiedStorage.js"       -Reason "Unified storage facade"
Remove-Target -Path "js\voice.js"                -Reason "Third-party voice transcription"
Remove-Target -Path "js\feedback.js"             -Reason "Feedback widget with external transmission"

# --- 5. Render and Supabase scripts --------------------------------------------
Remove-Target -Path "scripts\migrate-to-supabase.js"     -Reason "Supabase migration tool"
Remove-Target -Path "scripts\render-build-wrapper.js"    -Reason "Render build wrapper"
Remove-Target -Path "scripts\render-issue.js"            -Reason "Render-to-GitHub issue automation"
Remove-Target -Path "scripts\render-start-wrapper.js"    -Reason "Render start wrapper"
Remove-Target -Path "scripts\test-issue.js"              -Reason "GitHub issue smoke test"

# --- 6. Synthetic test data and historical state -------------------------------
Remove-Target -Path "server\local-data"     -Reason "Synthetic test data with realistic naming"
Remove-Target -Path ".tmp_sri"              -Reason "Transient SRI build artifacts"
Remove-Target -Path "node_modules"          -Reason "Backend node_modules no longer needed"

# --- 6b. Supabase commercial-database schema migrations ------------------------
Remove-Target -Path "supabase"              -Reason "Supabase commercial-database SQL migrations"

# --- 7. Integration documentation ----------------------------------------------
Remove-Target -Path "docs\SUPABASE_INTEGRATION.md"          -Reason "Supabase integration guide"
Remove-Target -Path "docs\SUPABASE_README.md"               -Reason "Supabase quick start"
Remove-Target -Path "docs\GITHUB_INTEGRATION.md"            -Reason "GitHub integration guide"
Remove-Target -Path "docs\ADMIN_DATA_SOURCE.md"             -Reason "Admin data source guide"
Remove-Target -Path "docs\PRD-Admin-Dashboard.md"           -Reason "Admin dashboard PRD"
Remove-Target -Path "docs\FEEDBACK_SETUP.md"                -Reason "Feedback widget setup"
Remove-Target -Path "docs\REUSABLE_FEEDBACK_PROMPT.md"      -Reason "Feedback prompt component"
Remove-Target -Path "docs\MIGRATION_GUIDE.md"               -Reason "Supabase migration guide"
Remove-Target -Path ".trae\documents\admin-dashboard-architecture.md" -Reason "Admin architecture"
Remove-Target -Path ".trae\documents\admin-dashboard-prd.md"          -Reason "Admin PRD"

# --- 8. Project tracker artifacts ---------------------------------------------
Remove-Target -Path "APP_DETAILS_DEMO.md"   -Reason "Production-marketing language replaced by README"

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Yellow
if ($DryRun) {
    Write-Host " DRY RUN COMPLETE. No files were deleted." -ForegroundColor Cyan
    Write-Host " Re-run without -DryRun to execute deletion." -ForegroundColor Cyan
} else {
    Write-Host " PHASE 1 STRIP COMPLETE." -ForegroundColor Green
    Write-Host ""
    Write-Host " Next steps:" -ForegroundColor White
    Write-Host "  1. Verify no fetch, localStorage, IndexedDB references remain:" -ForegroundColor White
    Write-Host "     Get-ChildItem -Recurse -Include *.js,*.html | Select-String 'fetch|localStorage|IndexedDB'" -ForegroundColor Gray
    Write-Host "  2. Run npm install to refresh dependencies against the new package.json." -ForegroundColor White
    Write-Host "  3. Open index.html directly in a browser to verify the warning banner appears." -ForegroundColor White
    Write-Host "  4. Confirm no network requests fire when using the methodology aid." -ForegroundColor White
    Write-Host "  5. Commit the strip on branch compliance/phase-1-strip." -ForegroundColor White
}
Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host ""
