const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

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
      const blog = {
        title: 'A blog created by Playwright',
        author: 'Wright Brothers',
        url: 'example.com/blogs/playwright'
      }

      await createBlog(page, blog)

      const blogDiv = await page.locator('.blog')
      await expect(blogDiv).toContainText('A blog created by Playwright')
      
      const successDiv = await page.locator('.success')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        const blog = {
          title: 'Another Blog by Playwright',
          author: 'Wright Brothers',
          url: 'example.com/blogs/playwright-2'
        }

        await createBlog(page, blog)
      })

      test.only('a blog can be liked', async ({ page }) => {
        const blogContainer = await page.locator('.blog')
          .filter({ hasText: 'Another Blog by Playwright'}) 
        await blogContainer.getByRole('button', { name: 'view' }).click()
        const blogDetails = blogContainer.locator('.blog-details')
        const likesText = await blogDetails.locator('text=/\\d+/').first().textContent()
        // Get the initial likes value
        const initialLikes = parseInt(likesText, 10)
        await blogDetails.getByText(likesText).waitFor()
        
        // Click the like button
        await blogDetails.getByRole('button', { name: 'like' }).click()
        
        // Check that the final likes value incremented by 1
        await expect(async () => {
          const newLikesText = await blogDetails.locator('text=/\\d+/').first().textContent()
          // Wait for the new likes to appear
          await blogDetails.getByText(newLikesText).waitFor()
          const newLikes = parseInt(newLikesText, 10)
          expect(newLikes).toBe(initialLikes + 1)
        }).toPass()
      })
    })
  })
})