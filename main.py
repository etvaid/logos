import sys
import os

# Add apps/api to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "apps", "api"))

# Import with different name to avoid circular import
import importlib.util
spec = importlib.util.spec_from_file_location("api_main", "apps/api/main.py")
api_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api_module)

app = api_module.app
