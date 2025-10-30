
import time
from playwright.sync_api import sync_playwright, expect

def run_verification(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        page.goto("http://127.0.0.1:8080/auth")

        # Use a unique email for each run
        email = f"testuser_{int(time.time())}@example.com"
        password = "password123"

        # Sign up
        page.click('text="Sign Up"')
        page.fill('input[id="email-signup"]', email)
        page.fill('input[id="password-signup"]', password)
        page.click('button:text("Sign Up")')

        # Wait for navigation to the main page and for tasks to load
        expect(page).to_have_url("http://127.0.0.1:8080/")
        expect(page.locator("text=No active tasks")).to_be_visible()

        # Take a screenshot of the main page
        page.screenshot(path="jules-scratch/verification/verification.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run_verification(playwright)
