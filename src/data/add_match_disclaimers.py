from pathlib import Path
import re

MATCHES_FILE = Path("matches.js")

DISCLAIMER = """
<div class="references">
  <span>Disclaimer:</span>
  <span>Some of this information was gathered using AI assistance</span>
</div>"""

def add_disclaimer_to_summary(match):
    summary_content = match.group(1)

    # Avoid adding it twice
    if "Some of this information was gathered using AI assistance" in summary_content:
        return match.group(0)

    # Remove trailing whitespace inside the template literal
    updated_summary = summary_content.rstrip()

    # Add disclaimer at the end of the summary
    updated_summary += "\n\n" + DISCLAIMER

    return f"summary: `{updated_summary}`"

def main():
    if not MATCHES_FILE.exists():
        raise FileNotFoundError(f"Could not find {MATCHES_FILE}")

    original = MATCHES_FILE.read_text(encoding="utf-8")

    # Backup first
    backup_file = MATCHES_FILE.with_suffix(".js.bak")
    backup_file.write_text(original, encoding="utf-8")

    # Finds every summary: ` ... `
    updated = re.sub(
        r"summary:\s*`([\s\S]*?)`",
        add_disclaimer_to_summary,
        original,
    )

    MATCHES_FILE.write_text(updated, encoding="utf-8")

    print("Done.")
    print(f"Backup created: {backup_file}")
    print(f"Updated file: {MATCHES_FILE}")

if __name__ == "__main__":
    main()