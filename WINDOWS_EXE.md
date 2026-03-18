# Windows EXE build

This project can ship as a Windows `.exe` while still opening in the user's normal web browser.

The executable runs the local Flask server from `wordmath.py` and then opens `http://127.0.0.1:<port>/` in the default browser. That means browser-only features, including Google search, continue to work.

End users do not need to install Python, spaCy, or the language model separately. Those are bundled into the packaged app folder.

## Build

From PowerShell in this folder:

```powershell
.\build_windows.ps1
```

Use Python `3.11` or `3.12` for the build. The current dependency stack is not reliable on Python `3.13`.

Optional flags:

```powershell
.\build_windows.ps1 -SpaCyModel en_core_web_lg
.\build_windows.ps1 -Python "C:\Path\To\Python311\python.exe"
.\build_windows.ps1 -Windowed
```

Notes:

- `en_core_web_lg` is the larger model and makes the app bundle bigger.
- `-Windowed` hides the console window. Leave it off if you want startup logs and visible errors.
- The script uses PyInstaller `--onedir` because it is more reliable than a single-file build for large NLP assets.

## Output

After a successful build, launch:

```powershell
.\dist\WordMath\WordMath.exe
```

## Distribution

Ship the whole `dist\WordMath\` folder, not only the `.exe`.

## Ready-to-share folder

To stage a distributable app folder:

```powershell
.\package_windows.ps1 -Python "C:\Path\To\Python311\python.exe"
```

By default this creates a windowless app build and writes:

```text
release\WordMath-windows\
```

Users can run `WordMath.exe` directly from that folder with no extra installations.

If `dist\WordMath\` already exists, the packaging script reuses that build by default and copies it into the release folder. Use `-Rebuild` if you want to force a fresh build first.
