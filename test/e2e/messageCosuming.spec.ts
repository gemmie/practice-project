import { test, expect } from '@playwright/test';
import axios from 'axios';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:5000/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle('test site');
    await expect(page.locator('p')).toHaveCount(0);

    await axios.post('http://localhost:5000/mqtt', {
        topic: 'topic1',
        message: 'testing',
    });

    await expect(page.locator('p')).toHaveCount(1);
});
