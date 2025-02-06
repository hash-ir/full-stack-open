const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Delete the test Blog and User database
    await request.post('http://localhost:3003/api/testing/reset')

    // Create a test user
    await request.post('http://localhost:3003/api/users', {
        data: {
            name: 'Test User',
            username: 'tester',
            password: 'vois-sur-ton-chemin'
        }
    })

    // Go to the app homepage
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
      
      // Check message and style of Notification component
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      
      await expect(page.getByText('Test User logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Log in with test user for the following tests
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
      
      // Check message and style of Notification component
      const successDiv = await page.locator('.success')
      await expect(successDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        // Create a blog for the following tests
        const blog = {
          title: 'Another Blog by Playwright',
          author: 'Wright Brothers',
          url: 'example.com/blogs/playwright-2'
        }
        await createBlog(page, blog)
      })

      test('a blog can be liked', async ({ page }) => {
        // Find the blog div and search for a blog by title
        const blogContainer = await page.locator('.blog')
          .filter({ hasText: 'Another Blog by Playwright'})
          
        // Click the view button to show blog details
        await blogContainer.getByRole('button', { name: 'view' }).click()

        // Find the first numerical value in blog details
        // This must be the likes text
        const blogDetails = blogContainer.locator('.blog-details')
        const likesText = await blogDetails.locator('text=/\\d+/').first().textContent()
        
        // Get the initial likes value
        const initialLikes = parseInt(likesText, 10)

        // Wait for the initial likes to render
        await blogDetails.getByText(likesText).waitFor()
        
        // Click the like button now to increase the likes
        await blogDetails.getByRole('button', { name: 'like' }).click()
        
        // Check that the new likes are 1 more than the initial likes
        await expect(async () => {
          // Again, the first numerical value will be the likes
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