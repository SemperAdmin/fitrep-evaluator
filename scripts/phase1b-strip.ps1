# =============================================================================
# FITREP Evaluator - Phase 1b Strip Script
# =============================================================================
# Purpose: Catch what Phase 1 missed. Removes the parallel React/TypeScript
#          Vite codebase, the .env file, the errorLogger module with its remote
#          fetch path, orphan tests, orphan styles, and stale documentation.
#
# Prerequisite: Phase 1 strip already executed via phase1-strip.ps1.
#
# Run from PowerShell at the project root:
#   cd D:\Coding\Fitness-Report-Evaluator
#   .\scripts\phase1b-strip.ps1
#
# Preview without deleting:
#   .\scripts\phase1b-strip.ps1 -DryRun
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
Write-Host " FITREP EVALUATOR - PHASE 1b STRIP" -ForegroundColor Yellow
Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Project root: $projectRoot"
Write-Host "DryRun mode:  $DryRun"
Write-Host ""

if (-not $Force -and -not $DryRun) {
    Write-Host "This script removes the React/TypeScript src/ directory, the .env" -ForegroundColor Red
    Write-Host "file, the errorLogger module, orphan tests, orphan styles, and stale" -ForegroundColor Red
    Write-Host "documentation that survived Phase 1." -ForegroundColor Red
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

# --- 1. Parallel React/TypeScript Vite codebase --------------------------------
Remove-Target -Path "src"                   -Reason "React TypeScript Vite scaffold, Supabase wired"
Remove-Target -Path "public"                -Reason "Vite public directory"

# --- 2. Express-era environment file -------------------------------------------
Remove-Target -Path ".env"                  -Reason "SESSION_SECRET and PORT residue"
Remove-Target -Path ".env.example"          -Reason "Example env, if present"
Remove-Target -Path ".env.local"            -Reason "Local env, if present"

# --- 3. Error logger with remote fetch and localStorage -------------------------
Remove-Target -Path "js\errorLogger.js"     -Reason "Remote fetch path and localStorage usage"

# --- 4. Orphan tests for deleted modules ---------------------------------------
Remove-Target -Path "tests\persistence.safeguards.test.js" -Reason "Tests deleted persistence module"
Remove-Target -Path "tests\profile.header.escape.test.js"  -Reason "Tests deleted profile module"
Remove-Target -Path "tests\errorLogger.test.js"            -Reason "Tests deleted errorLogger module"

# --- 5. Orphan styles ----------------------------------------------------------
Remove-Target -Path "styles\admin.css"      -Reason "Admin styles, admin.html already removed"

# --- 6. Stale documentation referencing prior architecture ---------------------
Remove-Target -Path "docs\PRD-COMPREHENSIVE-IMPROVEMENTS.md" -Reason "References Render and Supabase"
Remove-Target -Path "docs\NETWORK-EFFICIENCY.md"             -Reason "References network cache modules"
Remove-Target -Path "docs\UNIFIED-STORAGE.md"                -Reason "References unified storage module"
Remove-Target -Path "docs\MEMORY-MANAGEMENT.md"              -Reason "References cloud sync patterns"
Remove-Target -Path "docs\IMMEDIATE-ACTION-CHECKLIST.md"     -Reason "References exposed token incident"
Remove-Target -Path "docs\IMPLEMENTATION_SUMMARY.md"         -Reason "Describes deleted architecture"
Remove-Target -Path "docs\InstructionsExampleComponent.tsx.txt" -Reason "React migration artifact"
Remove-Target -Path "docs\GLOBALS-MIGRATION.md"              -Reason "Cloud-era migration doc"
Remove-Target -Path "docs\PERF-BENCHMARKS.md"                -Reason "Benchmarks against deleted modules"
Remove-Target -Path "docs\PERFORMANCE-IMPROVEMENTS.md"       -Reason "Performance against deleted modules"
Remove-Target -Path "docs\CONFIG.md"                         -Reason "References deleted backend config"

# --- 7. Trae IDE working files referencing dashboard --------------------------
Remove-Target -Path ".trae"                 -Reason "Trae IDE workspace, references prior architecture"

# --- 8. Stale eslint config (optional, keep if you still lint) ----------------
# The eslintrc remains useful for the surviving JS. Not deleted.

Write-Host ""
Write-Host "===========================================================" -ForegroundColor Yellow
if ($DryRun) {
    Write-Host " DRY RUN COMPLETE. No files were deleted." -ForegroundColor Cyan
    Write-Host " Re-run without -DryRun to execute deletion." -ForegroundColor Cyan
} else {
    Write-Host " PHASE 1b STRIP COMPLETE." -ForegroundColor Green
    Write-Host ""
    Write-Host " Next steps:" -ForegroundColor White
    Write-Host "  1. Verify surviving JS no longer has prohibited patterns:" -ForegroundColor White
    Write-Host "     Get-ChildItem -Recurse -Include *.js,*.html | Select-String 'fetch\(|localStorage|sessionStorage|IndexedDB|onrender|supabase|profileLoginCard|profileDashboardCard'" -ForegroundColor Gray
    Write-Host "  2. Open index.html and confirm the warning gate appears." -ForegroundColor White
    Write-Host "  3. Confirm DevTools Network tab shows zero outbound requests." -ForegroundColor White
    Write-Host "  4. Confirm DevTools Application tab shows zero localStorage / sessionStorage entries after first interaction." -ForegroundColor White
    Write-Host "  5. Commit Phase 1b on the compliance/phase-1-strip branch." -ForegroundColor White
}
Write-Host "===========================================================" -ForegroundColor Yellow
Write-Host ""
