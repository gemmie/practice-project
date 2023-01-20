import { test, expect } from '@playwright/test';
import axios from 'axios';

test('has title', async ({ page }) => {
    await page.goto('http://localhost:5000/');

    page.on('console', (msg) => console.log(msg.text()));

    await expect(page).toHaveTitle('test site');

    await page.getByText('connected').waitFor();

    await expect(page.locator('p')).toHaveCount(1);

    await axios.post('http://localhost:5000/mqtt', {
        topic: 'topic1',
        message: 'testing',
    });

    await expect(page.locator('p')).toHaveCount(2);
});
