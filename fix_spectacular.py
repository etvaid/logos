#!/usr/bin/env python3
"""
Fix LOGOS SPECTACULAR files that have markdown code fence artifacts
"""

import os
import re
from pathlib import Path

def fix_file(filepath: Path) -> bool:
    """Remove markdown artifacts and fix exports"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Remove opening code fences at start of file
        # Match ```tsx, ```typescript, ```jsx, ```javascript at start
        content = re.sub(r'^```(?:tsx?|jsx?|typescript|javascript)\s*\n', '', content)
        
        # Remove closing code fences at end of file  
        content = re.sub(r'\n```\s*$', '', content)
        
        # Also handle code fences that might be on their own lines
        content = re.sub(r'^```\s*\n', '', content)
        content = re.sub(r'\n```\s*\n', '\n', content)
        
        # Fix missing default exports for React components
        # If file has a component but no default export, add one
        if filepath.suffix in ['.tsx', '.jsx']:
            # Check if there's a main component function
            component_match = re.search(r'(?:const|function)\s+(\w+)(?::\s*React\.FC|\s*=\s*\([^)]*\)\s*(?::\s*[^=]+)?\s*=>|\s*\([^)]*\)\s*{)', content)
            if component_match:
                component_name = component_match.group(1)
                # Check if already has default export
                if f'export default {component_name}' not in content and 'export default' not in content:
                    # Add export at end
                    content = content.rstrip() + f'\n\nexport default {component_name}\n'
                    
                # Also check for named export
                if f'export {{ {component_name}' not in content and f'export const {component_name}' not in content:
                    # Add named export
                    content = content.replace(f'const {component_name}', f'export const {component_name}', 1)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False
        
    except Exception as e:
        print(f"   ⚠️  Error processing {filepath}: {e}")
        return False

def main():
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python fix_spectacular.py /path/to/frontend")
        sys.exit(1)
        
    frontend_dir = Path(sys.argv[1])
    
    if not frontend_dir.exists():
        print(f"Directory not found: {frontend_dir}")
        sys.exit(1)
        
    print(f"🔧 Fixing files in {frontend_dir}...")
    
    fixed_count = 0
    
    # Fix all tsx/jsx files
    for ext in ['*.tsx', '*.jsx', '*.ts', '*.js']:
        for filepath in frontend_dir.rglob(ext):
            if 'node_modules' in str(filepath):
                continue
            if fix_file(filepath):
                print(f"   ✅ Fixed: {filepath.relative_to(frontend_dir)}")
                fixed_count += 1
                
    print(f"\n✅ Fixed {fixed_count} files")

if __name__ == "__main__":
    main()
