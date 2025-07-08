import socket
import subprocess
import json
import traceback
import time
import requests

def comprehensive_connection_debug(host="127.0.0.1", port=4723):
    """Debug connection issues comprehensively"""
    print(f"=== Debugging connection to {host}:{port} ===")

    # Test socket connection
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        print(f"Socket connection: {'SUCCESS' if result == 0 else 'FAILED'}")
    except Exception as e:
        print(f"Socket test error: {e}")

    # Test with netcat
    try:
        result = subprocess.run(['nc', '-zv', host, str(port)],
                              capture_output=True, text=True, timeout=5)
        print(f"Netcat test: {result.stderr.strip()}")
    except:
        print("Netcat not available")

    # Test HTTP connection
    try:
        import requests
        response = requests.get(f"http://{host}:{port}/wd/hub/status", timeout=5)
        print(f"HTTP status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except Exception as e:
        print(f"HTTP test failed: {e}")
        traceback.print_exc()

    # Test DNS resolution
    try:
        ip = socket.gethostbyname(host)
        print(f"DNS resolution: {host} -> {ip}")
    except Exception as e:
        print(f"DNS resolution failed: {e}")
        traceback.print_exc()

def validate_appium_session_readiness(base_url, timeout=90):
    """Validate that Appium server can handle session creation"""
    session_url = f"{base_url}/wd/hub/session"

    # Minimal capabilities for validation
    capabilities = {
        "desiredCapabilities": {
            "platformName": "Android",
            "deviceName": "test"
        }
    }

    try:
        # Attempt session creation (will fail but validates readiness)
        response = requests.post(session_url, json=capabilities, timeout=30)

        # Even if session fails, a proper response indicates readiness
        if response.status_code in [200, 400, 500]:
            return True

    except requests.exceptions.RequestException as ext:
        print("Traceback Info:", ext)
        traceback.print_exc()
        pass


    return False





comprehensive_connection_debug()
validate_appium_session_readiness("http://127.0.0.1:4723")
