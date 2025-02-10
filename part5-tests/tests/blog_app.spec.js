const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, logout, postBlogs, getUserToken } = require('./helper')

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
        test.setTimeout(5000)
        await page.waitForSelector('.blog')
        const blogContainer = await page.locator('.blog')
          .filter({ hasText: 'Another Blog by Playwright' })
          
        // Click the view button to show blog details
        await blogContainer.getByRole('button', { name: 'view' }).click()
        const blogDetails = await blogContainer.locator('.blog-details')

        // Get initial likes
        const likesElement = blogDetails.getByTestId('likes')
        const initialLikes = parseInt(await likesElement.textContent(), 10)
        
        // Click like and wait for the network response to complete
        await blogDetails.getByRole('button', { name: 'like' }).click()
        
        /* Wait for likes to update using polling assertion. Use in
        tandem with test.setTimeout.

        Docs: https://playwright.dev/docs/test-assertions#expecttopass */
        await expect(async () => {
          const newLikes = parseInt(await likesElement.textContent(), 10)
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
          // .waitFor({ state: 'visible' })
        // await blogContainer.waitFor()

        // Click the view button to show blog details
        await blogContainer.getByRole('button', { name: 'view' }).click()

        // Check that the remove button is not visible 'junior'
        // who did not create the blog
        const blogDetails = blogContainer.locator('.blog-details')
        await expect(blogDetails.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })
    })

    describe('and multiple blogs exist', () => {
      let token
      
      beforeEach(async ({ page }) => {
        // Increase test timeout for this hook since we're creating
        // multiple blogs
        test.setTimeout(10000)

        // Create the following test blogs
        const blogs = [
          {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
          },
          {
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
          },
          {
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
          },
          {
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
          },
          {
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
          },
          {
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
          }  
        ]

        // Get authentication token of logged in user
        const response = await getUserToken('senior', 'srpass')
        token = `Bearer ${(await response.json()).token}`

        // Send a post API call to the server
        await postBlogs(blogs, token)
        await page.reload()

        // Wait for atleast one blog to be visible after reload
        await page.waitForSelector('.blog')
      })

      test('blogs are arranged in the decreasing order of likes', async ({ page }) => {
        const blogs = await page.locator('.blog')
        const count = await blogs.count()
  
        /* The DOM order of blogs is maintained here since because of
        the for loop (sequential), the 'view' buttons are clicked in
        order and awaited (sequential await) before pushing each
        promise to the array 
        A nice guide: https://jrsinclair.com/articles/2019/how-to-run-async-js-in-parallel-or-sequential/ */ 
        const promises = []
        for (let i = 0; i < count; i++) {
          const blog = blogs.nth(i)
          await blog.getByRole('button', { name: 'view' }).click()
          promises.push(blog.getByTestId('likes').textContent())
        }

        // Gather all the likes (promises)
        const likesTexts = await Promise.all(promises)
        const likes = likesTexts.map(like => parseInt(like))
    
        // Check that likes are in decreasing order
        const isSorted = likes.every((like, i) => i === 0 || like <= likes[i - 1])
        expect(isSorted).toBe(true)
      })
    })
  })
})