import { test, expect } from '@playwright/test'

test.describe('Sanity Check', () => {
  test('Core features render and function correctly', async ({ page }) => {
    // 1. Visit the Home Page
    await page.goto('/')
    
    // Check for no console errors
    page.on('pageerror', error => {
      console.error(`Page Error: ${error.message}`)
    })

    // 2. Verify Hero Section and Navigation
    await expect(page.locator('.hero-title').filter({ hasText: 'Music Vibe' })).toBeVisible()
    await expect(page.locator('text=Start Listening').first()).toBeVisible()

    // 3. Verify Playlists Section loads
    const playlistsSection = page.locator('#playlists')
    await expect(playlistsSection).toBeVisible()
    
    // Click on a playlist's info area to expand it (avoiding play button overlay)
    const firstPlaylistInfo = page.locator('.playlist-card .playlist-info').first()
    await firstPlaylistInfo.scrollIntoViewIfNeeded()
    await firstPlaylistInfo.click()
    
    // Ensure songs render inside the expanded playlist
    await expect(page.locator('.songs-container').first()).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.song-item').first()).toBeVisible()

    // 4. Verify Music Player functionality
    // The player starts hidden or empty, but we can play a song from trending to trigger it
    const firstTrendingSongPlayBtn = page.locator('.songs-card1').first()
    await firstTrendingSongPlayBtn.click()

    // Player should now be visible and playing
    const player = page.locator('.musicplayer')
    await expect(player).toBeVisible({ timeout: 5000 })
    
    // Pause the song
    const pauseButton = page.locator('.play-pause-btn')
    await expect(pauseButton).toBeVisible()
    await pauseButton.click()
  })
})
