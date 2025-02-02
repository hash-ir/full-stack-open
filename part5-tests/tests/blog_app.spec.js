const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Test User',
            username: 'tester',
            password: 'vois-sur-ton-chemin'
        }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('textbox').first()).toBeVisible()
    await expect(page.getByRole('textbox').last()).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await page.getByTestId('username').fill('tester')
        await page.getByTestId('password').fill('vois-sur-ton-chemin')
        await page.getByRole('button', { name: 'login' }).click()
        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await page.getByTestId('username').fill('tester')
        await page.getByTestId('password').fill('wrong')
        await page.getByRole('button', { name: 'login' }).click()
        
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('invalid username or password')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        
        await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })
})