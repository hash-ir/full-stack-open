import { expect, request } from '@playwright/test'

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  // Slow down the insert operation
  // Wait for the created blog to render
  await page.locator('.blog')
    .filter({ hasText: title })
    .waitFor({ state: 'visible' })
}

const getUserToken = async (username, password) => {
  const contextRequest = await request.newContext()
  const response = await contextRequest.post('http://localhost:3003/api/login', {
    data: {
      username: username,
      password: password
    }
  })

  expect(response.status()).toBe(200)
  return response
}

const postBlogs = async (blogs, token) => {
  const contextRequest = await request.newContext()
  const promises = blogs.map(blog => 
    contextRequest.post('http://localhost:3003/api/blogs', {
      data: blog,
      headers: {
        Authorization: token
      }
    })
  )
  return await Promise.all(promises)
}

export { loginWith, logout, createBlog, getUserToken, postBlogs }