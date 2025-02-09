const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Delete the test Blog and User database
    await request.post('http://localhost:3003/api/testing/reset')

    // Create a test user
    await request.post('http://localhost:3003/api/users', {
      data: {
          name: 'Senior Tester',
          username: 'senior',
          password: 'srpass'
      }
    })

    // Create another user
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Junior Tester',
        username: 'junior',
        password: 'jrpass'
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
      await loginWith(page, 'senior', 'srpass')
      await expect(page.getByText('Senior Tester logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'senior', 'wrong')
      
      const errorDiv = await page.locator('.error')
      
      // Check message and style of Notification component
      await expect(errorDiv).toContainText('invalid username or password')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      
      await expect(page.getByText('Senior Tester logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      // Log in with test user for the following tests
      await loginWith(page, 'senior', 'srpass')
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
          .filter({ hasText: 'Another Blog by Playwright' })
          
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

      test('a blog can be deleted only by the user who added it', async ({ page }) => {
        // Find the blog div and search for a blog by title
        const blogContainer = await page.locator('.blog')
          .filter({ hasText: 'Another Blog by Playwright' })

        // Click the view button to show blog details
        await blogContainer.getByRole('button', { name: 'view' }).click()

        const blogDetails = blogContainer.locator('.blog-details')

        // Accept the blog deletion dialog
        page.on('dialog', dialog => dialog.accept())
        await blogDetails.getByRole('button', { name: 'remove' }).click()

        // Check that the blog doesn't exist anymore
        const updatedBlogContainer = await page.locator('.blog')
          .getByText('Another Blog by Playwright')
          .waitFor()
        expect(updatedBlogContainer).not.toBeDefined()
      })

      test('the remove button is visible only to the user who added the blog', async ({ page }) => {
        // Log out from 'senior' and log in with the 'junior'
        await logout(page)
        await loginWith(page, 'junior', 'jrpass')

        // Find the blog div and search for a blog by title
        await page.waitForSelector('.blog')
        const blogContainer = await page.locator('.blog')
          .filter({ hasText: 'Another Blog by Playwright' })
        await blogContainer.waitFor()

        // Click the view button to show blog details
        await blogContainer.getByRole('button', { name: 'view' }).click()

        // Check that the remove button is not visible 'junior'
        // who did not create the blog
        const blogDetails = blogContainer.locator('.blog-details')
        await expect(blogDetails.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })
    })
  })
})