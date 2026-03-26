$repo = "C:/Users/MSI/source/repos/modular-ecommerce"
$settingsPath = "$repo/.vscode/settings.json"

$worktrees = git -C $repo worktree list --porcelain |
    Select-String '^worktree ' |
    ForEach-Object { ($_ -replace 'worktree ', '').Trim() -replace '\\', '/' } |
    Where-Object { $_ -ne $repo }

$settings = Get-Content $settingsPath -Raw | ConvertFrom-Json
$settings.'git.ignoredRepositories' = @($worktrees)
$settings | ConvertTo-Json -Depth 5 | Set-Content $settingsPath
