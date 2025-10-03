const { execSync } = require('child_process');

try {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
  const files = output.split('\n').filter(Boolean);
  const forbidden = ['.env', '.env.local'];
  const found = files.filter(f => forbidden.includes(f) || f.endsWith('.env'));
  if (found.length) {
    console.error('Error: You are trying to commit environment files:', found.join(', '));
    console.error('Remove them from the commit or update .gitignore. Aborting.');
    process.exit(1);
  }
  // Optionally scan staged file contents for the string 'VITE_TMDB_API_KEY' or 'api_key='
  const stagedText = execSync('git diff --cached --unified=0', { encoding: 'utf8' });
  if (/VITE_TMDB_API_KEY|api_key=/.test(stagedText)) {
    console.error('Warning: staged changes include possible API keys. Please double-check.');
    process.exit(1);
  }
  process.exit(0);
} catch (err) {
  console.error(err.message || err);
  process.exit(1);
}
