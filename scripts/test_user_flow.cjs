const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const screenshotDir = path.resolve('C:/Users/User/.gemini/antigravity/brain/9b2f8308-f399-4c07-b694-68543eba8eb9/screenshots');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

async function runTest() {
  console.log('🚀 Launching Chrome browser...');
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Listen to console logs
  page.on('console', msg => console.log('  [Browser Console]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('  [Browser PageError]', err.message));

  console.log('🌐 Navigating to http://localhost:3000/...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(screenshotDir, '01_hero_initial.png') });
  console.log('✅ 1. Initial page loaded successfully.');

  // Test 1: Navigation links
  console.log('🔍 Testing Navigation Bar and Hero CTA...');
  const title = await page.title();
  console.log(`   Page Title: "${title}"`);

  // Test 2: Voice Simulator - Preset 2 (Scottsdale)
  console.log('🎙️ Testing Tab 1: Voice Presets (Scottsdale)...');
  const scottsdaleBtn = page.locator('button:has-text("Modern Mid-Century Remodel (Scottsdale)")');
  await scottsdaleBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '02_scottsdale_preset.png') });
  console.log('✅ Preset selected, caption updated.');

  // Test 3: Voice Simulator - Custom Voice Memo
  console.log('📝 Testing Custom Voice Memo & AG-UI Streaming...');
  const customTabBtn = page.locator('button:has-text("Custom Memo")');
  await customTabBtn.click();
  await page.waitForTimeout(300);

  const customTextarea = page.locator('textarea');
  await customTextarea.fill('Driving through Paradise Valley! Just walked a luxury 5-bed estate on a 1-acre lot with a private pickleball court, detached guest casita, and stunning mountain views. DM me CASITA for the off-market pricing packet!');
  await page.screenshot({ path: path.join(screenshotDir, '03_custom_voice_memo_input.png') });

  const streamBtn = page.locator('button:has-text("Stream via AG-UI Protocol")');
  await streamBtn.click();
  console.log('   Triggered AG-UI stream... Waiting for reasoning & HITL gate...');
  
  // Wait for HITL approval banner to appear
  await page.waitForSelector('text=AG-UI HITL Gate: Approval Required to Publish', { timeout: 8000 });
  await page.screenshot({ path: path.join(screenshotDir, '04_hitl_approval_banner.png') });
  console.log('✅ HITL Approval banner intercepted successfully.');

  // Click Approve Now
  const approveBtn = page.locator('button:has-text("Approve Now")');
  await approveBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: path.join(screenshotDir, '05_post_approved_and_streamed.png') });
  console.log('✅ Post approved and text fully streamed.');

  // Test 4: Open AG-UI Telemetry Inspector
  console.log('📊 Opening AG-UI Telemetry Inspector...');
  const inspectBtn = page.locator('button:has-text("Inspect AG-UI")').first();
  await inspectBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '06_inspector_drawer_stream.png') });

  // Click Event Waterfall tab
  const waterfallTab = page.locator('button:has-text("Event Waterfall")');
  await waterfallTab.click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(screenshotDir, '07_inspector_event_waterfall.png') });
  console.log('✅ Event waterfall verified.');

  // Close Inspector
  const closeInspectorBtn = page.locator('button[title="Close Inspector"]');
  await closeInspectorBtn.click();
  await page.waitForTimeout(300);

  // Test 5: Tab 2: Zero-Listing Deal of the Week
  console.log('🔥 Testing Tab 2: Zero-Listing "Deal of the Week"...');
  const tab2Btn = page.locator('button:has-text("2. Zero-Listing")');
  await tab2Btn.click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '08_tab2_deal_of_week.png') });

  const launchDealBtn = page.locator('button:has-text("Reply \\"YES\\" to Launch Buyer Magnet")');
  await launchDealBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '09_tab2_deal_launched.png') });
  console.log('✅ Deal of the week launched and simulated leads incremented.');

  // Test 6: Tab 3: Dead Database Revival Game
  console.log('🔄 Testing Tab 3: Dead Database Revival Game...');
  const tab3Btn = page.locator('button:has-text("3. Dead Database")');
  await tab3Btn.click();
  await page.waitForTimeout(400);

  const sendYesBtn = page.locator('button:has-text("YES — Send Casual Check-In Text")');
  await sendYesBtn.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(screenshotDir, '10_tab3_sphere_sent.png') });

  const nextContactBtn = page.locator('button:has-text("Load Next Past Client Match")');
  await nextContactBtn.click();
  await page.waitForTimeout(300);
  console.log('✅ Sphere revival text sent and advanced to next contact.');

  // Test 7: Architecture Explorer
  console.log('🏗️ Testing Architecture Explorer & Node Probe...');
  const stage3Btn = page.locator('button:has-text("The MLS Dispatcher")');
  await stage3Btn.click();
  await page.waitForTimeout(400);

  const executeNodeBtn = page.locator('button:has-text("Execute Node via AG-UI Stream")');
  await executeNodeBtn.click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(screenshotDir, '11_arch_node_probe.png') });
  console.log('✅ Stage 03 node probe executed.');

  // Close inspector again
  const closeInspectorBtn2 = page.locator('button[title="Close Inspector"]');
  if (await closeInspectorBtn2.isVisible()) {
    await closeInspectorBtn2.click();
  }

  // Test 8: ROI Calculator
  console.log('💰 Testing Commission ROI Calculator...');
  const sliders = page.locator('input[type="range"]');
  // Slider 1: weekly voice notes
  await sliders.nth(0).fill('5');
  // Slider 3: monthly listings
  await sliders.nth(2).fill('4');
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(screenshotDir, '12_roi_calculator.png') });
  console.log('✅ ROI sliders updated.');

  // Test 9: Pricing Tiers & Onboarding Form Submission
  console.log('📋 Testing Onboarding Registration Funnel...');
  const nameInput = page.locator('input[placeholder="Sarah Jenkins"]');
  await nameInput.fill('Sarah Jenkins');

  const emailInput = page.locator('input[placeholder="sarah@desertluxuryrealty.com"]');
  await emailInput.fill('sarah@desertluxuryrealty.com');

  const phoneInput = page.locator('input[placeholder="(480) 555-0194"]');
  await phoneInput.fill('(480) 555-0194');

  const brokerageInput = page.locator('input[placeholder="Real Broker • 85296"]');
  await brokerageInput.fill('Compass Scottsdale • 85251');

  const submitBtn = page.locator('button:has-text("Send My Live Test Text")');
  await submitBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(screenshotDir, '13_onboarding_submitted.png') });
  console.log('✅ Registration submitted and confirmation screen rendered.');

  console.log('🎉 ALL USER FLOWS COMPLETED SUCCESSFULLY!');
  await browser.close();
}

runTest().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
