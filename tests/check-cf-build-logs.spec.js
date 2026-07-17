import { test } from '@playwright/test';
import { execSync } from 'child_process';

const ACCOUNT_ID = 'c057790ce7e574569a70da0c021e9037';

function safariJS(js) {
  const escaped = js.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const script = `tell application "Safari"\nset theTab to current tab of front window\nset theResult to do JavaScript "${escaped}" in theTab\nreturn theResult\nend tell`;
  return execSync(`osascript -e '${script.replace(/'/g, "'\\''")}'`, {
    encoding: 'utf8',
    timeout: 30000,
  }).trim();
}

function safariNavigate(url) {
  const script = `tell application "Safari"\nset URL of current tab of front window to "${url}"\nend tell`;
  execSync(`osascript -e '${script}'`, { encoding: 'utf8', timeout: 10000 });
}

async function waitFor(conditionJS, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const result = safariJS(conditionJS);
    if (result && result !== 'false' && result !== '0' && result !== 'null') return result;
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Timeout waiting for condition`);
}

function screenshot(name) {
  execSync(`screencapture -x /tmp/${name}`, { encoding: 'utf8' });
  console.log('Screenshot:', `/tmp/${name}`);
}

test('check motherlight failed build logs', async () => {
  test.setTimeout(180000);
  console.log('\n--- Reading Cloudflare build logs for motherlight ---');

  // Step 1: navigate to deployments tab
  const deploymentsUrl = `https://dash.cloudflare.com/${ACCOUNT_ID}/workers/services/view/motherlight/production/deployments`;
  safariNavigate(deploymentsUrl);
  console.log('Navigating to deployments...');

  // Poll with debug output until page renders
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const url = safariJS('document.location.href');
    const readyState = safariJS('document.readyState');
    const bodyLen = safariJS('document.body ? document.body.innerText.length : 0');
    const hasContent = safariJS(`document.body.innerText.includes('Version History') || document.body.innerText.includes('Active deployment') || document.body.innerText.includes('build history') ? 'yes' : ''`);
    console.log(`  [${i}] url=${url.substring(0,60)} ready=${readyState} bodyLen=${bodyLen} hasContent=${hasContent}`);
    if (hasContent === 'yes') break;
  }

  screenshot('cf-01-deployments.png');
  console.log('Deployments page loaded.');

  // Get "View build history" URL
  const buildHistoryUrl = safariJS(`
    (function() {
      var links = Array.from(document.querySelectorAll('a'));
      var match = links.find(function(l) { return /build history/i.test(l.textContent); });
      return match ? match.href : '';
    })()
  `);

  const targetUrl = buildHistoryUrl ||
    `https://dash.cloudflare.com/${ACCOUNT_ID}/workers/services/motherlight/production/deployment-history`;

  console.log('Build history URL:', targetUrl);

  // Step 2: navigate to build history
  safariNavigate(targetUrl);
  console.log('Navigating to build history...');

  // Wait for build rows to appear
  await waitFor(`
    (function() {
      var rows = document.querySelectorAll('tr, [role="row"]');
      return rows.length > 1 ? String(rows.length) : '';
    })()
  `, 30000);

  screenshot('cf-02-build-history.png');

  // Read build rows
  const buildsJson = safariJS(`
    (function() {
      var rows = Array.from(document.querySelectorAll('tr, [role="row"]'));
      return JSON.stringify(rows.slice(0, 15).map(function(r) {
        var links = r.querySelectorAll('a');
        return {
          text: r.innerText.replace(/\\s+/g, ' ').trim().substring(0, 200),
          hrefs: Array.from(links).map(function(l) { return l.href; })
        };
      }).filter(function(r) { return r.text.length > 2; }));
    })()
  `);

  console.log('\nBuild rows found:');
  let builds = [];
  try { builds = JSON.parse(buildsJson); } catch (e) { /* ignore */ }
  builds.forEach((b, i) => console.log(`  [${i}] ${b.text} | links: ${b.hrefs.join(', ')}`));

  // Step 3: find the failed build and click into it
  const failedLink = safariJS(`
    (function() {
      var rows = Array.from(document.querySelectorAll('tr, [role="row"]'));
      for (var i = 0; i < rows.length; i++) {
        var text = (rows[i].innerText || '').toLowerCase();
        if (text.includes('fail') || text.includes('error')) {
          var links = rows[i].querySelectorAll('a');
          for (var j = 0; j < links.length; j++) {
            if (links[j].href.includes('cloudflare.com')) return links[j].href;
          }
        }
      }
      // Fallback: first row with a link (most recent build)
      var firstLink = document.querySelector('tbody tr a, [role="row"] a');
      return firstLink ? firstLink.href : '';
    })()
  `);

  // From the build rows, pick the Cloudflare build link for the git-triggered commit (not GitHub link, not manual)
  const cfBuildLink = safariJS(`
    (function() {
      var rows = Array.from(document.querySelectorAll('tr, [role="row"]'));
      for (var i = 0; i < rows.length; i++) {
        var links = Array.from(rows[i].querySelectorAll('a'));
        // Find rows that have both a github commit link AND a cloudflare build link
        var cfLink = links.find(function(l) { return l.href.includes('/builds/'); });
        var ghLink = links.find(function(l) { return l.href.includes('github.com'); });
        if (cfLink && ghLink) return cfLink.href;
      }
      // Fallback: any cloudflare builds link
      var anyBuild = document.querySelector('a[href*="/builds/"]');
      return anyBuild ? anyBuild.href : '';
    })()
  `);

  const buildDetailUrl = cfBuildLink ||
    `https://dash.cloudflare.com/${ACCOUNT_ID}/workers/services/view/motherlight/production/builds/13463931-08f9-4596-ac17-ef0e216d5a86`;

  console.log('\nCloudflare build detail URL:', buildDetailUrl);

  // Step 4: open the failed build detail
  safariNavigate(buildDetailUrl);
  console.log('Navigating to build detail...');

  // Wait for build log content
  await waitFor(`
    (function() {
      var pre = document.querySelector('pre, [class*="log"], [class*="terminal"], [class*="output"]');
      return pre && pre.innerText.trim().length > 50 ? 'yes' : '';
    })()
  `, 30000).catch(() => 'timeout');

  screenshot('cf-03-build-detail.png');

  const buildLog = safariJS(`
    (function() {
      var selectors = ['pre', '[class*="terminal"]', '[class*="log"]', '[class*="output"]', '[class*="console"]', 'code'];
      var texts = [];
      selectors.forEach(function(sel) {
        Array.from(document.querySelectorAll(sel)).forEach(function(el) {
          var t = el.innerText.trim();
          if (t.length > 20) texts.push(t);
        });
      });
      return texts.length > 0 ? texts.join('\\n---\\n') : document.body.innerText.substring(0, 5000);
    })()
  `);

  console.log('\n===== BUILD LOG =====');
  console.log(buildLog.substring(0, 5000));
  console.log('===== END BUILD LOG =====');
  console.log('\nScreenshots saved to /tmp/cf-0*.png');
});
