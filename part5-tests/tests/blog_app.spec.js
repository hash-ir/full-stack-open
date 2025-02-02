const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

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
        await loginWith(page, 'tester', 'vois-sur-ton-chemin')
        await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'tester', 'wrong')
        
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('invalid username or password')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
        
        await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
        loginWith(page, 'tester', 'vois-sur-ton-chemin')
    })

    test('a new blog can be created', async ({ page }) => {
        await page.getByRole('button', { name: 'create new blog' }).click()
        await page.getByTestId('title').fill('A blog created by Playwright')
        await page.getByTestId('author').fill('Wright Brothers')
        await page.getByTestId('url').fill('example.com/blogs/playwright')
        await page.getByRole('button', { name: 'create' }).click()

        const blogDiv = await page.locator('.blog')
        await expect(blogDiv).toContainText('A blog created by Playwright')
        
        const successDiv = await page.locator('.success')
        await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })
  })
})