<script lang="ts">
  import { Body } from '$lib';
  import type { ExtendedBodyPart } from '$lib/types';
  import { onMount } from 'svelte';

  let selectedBodyParts: ExtendedBodyPart[] = [
    { slug: 'chest', intensity: 1, side: 'left' },
    { slug: 'biceps', intensity: 2 }
  ];

  let side: 'front' | 'back' = 'front';
  let gender: 'male' | 'female' = 'male';
  let theme: 'light' | 'dark' = 'light';

  // Load theme from localStorage on mount
  onMount(() => {
    const savedTheme = localStorage.getItem('body-highlighter-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      theme = savedTheme;
    }
    // Always apply theme to ensure CSS variables are set
    applyTheme(theme);
  });

  function handleBodyPartPress(bodyPart: ExtendedBodyPart, partSide?: 'left' | 'right') {
    console.log('Body part clicked:', bodyPart.slug, partSide);

    // Add or update the selected body part
    const existingIndex = selectedBodyParts.findIndex(
      bp => bp.slug === bodyPart.slug && bp.side === partSide
    );

    if (existingIndex >= 0) {
      // Remove if already selected
      selectedBodyParts = selectedBodyParts.filter((_, i) => i !== existingIndex);
    } else {
      // Add with intensity 2
      selectedBodyParts = [
        ...selectedBodyParts,
        { slug: bodyPart.slug, intensity: 2, side: partSide }
      ];
    }
  }

  function toggleSide() {
    side = side === 'front' ? 'back' : 'front';
  }

  function toggleGender() {
    gender = gender === 'male' ? 'female' : 'male';
  }

  function clearSelection() {
    selectedBodyParts = [];
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(theme);
    localStorage.setItem('body-highlighter-theme', theme);
  }

  function applyTheme(selectedTheme: 'light' | 'dark') {
    const root = document.documentElement;

    if (selectedTheme === 'dark') {
      // Dark theme colors - lighter body parts on dark background
      root.style.setProperty('--body-part-default-color', '#95a5a6'); // Lighter gray for body parts
      root.style.setProperty('--body-outline-color', '#bdc3c7'); // Light outline
      root.style.setProperty('--body-part-intensity-1-color', '#a29bfe'); // Light purple
      root.style.setProperty('--body-part-intensity-2-color', '#6c5ce7'); // Dark purple
      root.style.setProperty('--body-part-head-color', '#5d6d7e'); // Darker gray for head in dark theme
      root.style.setProperty('--body-display-bg', '#2c3e50'); // Dark blue-gray background
    } else {
      // Light theme colors (defaults)
      root.style.setProperty('--body-part-default-color', '#3f3f3f');
      root.style.setProperty('--body-outline-color', '#dfdfdf');
      root.style.setProperty('--body-part-intensity-1-color', '#74b9ff'); // Light blue
      root.style.setProperty('--body-part-intensity-2-color', '#0984e3'); // Dark blue
      root.style.setProperty('--body-part-head-color', '#bebebe'); // Light gray for head in light theme
      root.style.setProperty('--body-display-bg', '#f8f9fa'); // Light background
    }
  }
</script>

<svelte:head>
  <title>Svelte Body Highlighter Demo</title>
  <meta name="description" content="Interactive demo of svelte-body-highlighter" />
</svelte:head>

<main>
  <h1>Svelte Body Highlighter</h1>
  <p class="subtitle">Interactive muscle group highlighter for Svelte applications</p>

  <div class="container">
    <div class="body-display">
      <Body
        data={selectedBodyParts}
        {gender}
        {side}
        scale={1.7}
        border="#dfdfdf"
        onBodyPartPress={handleBodyPartPress}
      />
    </div>

    <div class="controls">
      <div class="control-group">
        <h3>View Controls</h3>
        <label class="toggle">
          <input type="checkbox" checked={side === 'front'} on:change={toggleSide} />
          <span>Side: <strong>{side}</strong></span>
        </label>
        <label class="toggle">
          <input type="checkbox" checked={gender === 'male'} on:change={toggleGender} />
          <span>Gender: <strong>{gender}</strong></span>
        </label>
        <label class="toggle">
          <input type="checkbox" checked={theme === 'light'} on:change={toggleTheme} />
          <span>Theme: <strong>{theme}</strong></span>
        </label>
      </div>

      <div class="control-group">
        <div class="header-with-action">
          <h3>Selected Parts ({selectedBodyParts.length})</h3>
          {#if selectedBodyParts.length > 0}
            <button class="clear-btn" on:click={clearSelection}>Clear All</button>
          {/if}
        </div>
        {#if selectedBodyParts.length === 0}
          <p class="empty-state">Click on body parts to select them</p>
        {:else}
          <ul class="selected-list">
            {#each selectedBodyParts as part, i (i)}
              <li>
                <span class="part-name">{part.slug}</span>
                {#if part.side}
                  <span class="part-side">({part.side})</span>
                {/if}
                <span class="part-intensity">Intensity: {part.intensity}</span>
              </li>
            {/each}
          </ul>
        {/if}
      </div>

      <div class="control-group">
        <h3>Instructions</h3>
        <ul class="instructions">
          <li>Click on body parts to toggle selection</li>
          <li>Toggle between front and back views</li>
          <li>Switch between male and female anatomy</li>
          <li>Selected parts are highlighted in blue</li>
        </ul>
      </div>

      <div class="control-group">
        <h3>CSS Customization</h3>
        <p class="info-text">Toggle the theme above to see how CSS variables can customize the body highlighter. All colors are controlled via CSS custom properties.</p>
        <div class="css-example">
          <pre><code>/* {theme === 'dark' ? 'Dark' : 'Light'} Theme */
:root {'{'}
  --body-part-default-color: {theme === 'dark' ? '#95a5a6' : '#3f3f3f'};
  --body-outline-color: {theme === 'dark' ? '#bdc3c7' : '#dfdfdf'};
  --body-part-intensity-1-color: {theme === 'dark' ? '#a29bfe' : '#74b9ff'};
  --body-part-intensity-2-color: {theme === 'dark' ? '#6c5ce7' : '#0984e3'};
  --body-display-bg: {theme === 'dark' ? '#2c3e50' : '#f8f9fa'};
{'}'}</code></pre>
        </div>
      </div>
    </div>
  </div>

  <div class="footer">
    <p>
      <a href="https://github.com/thwbh/svelte-body-highlighter" target="_blank">View on GitHub</a>
      |
      <a href="https://www.npmjs.com/package/svelte-body-highlighter" target="_blank">NPM Package</a>
    </p>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  main {
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  h1 {
    text-align: center;
    color: white;
    font-size: 3rem;
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }

  .subtitle {
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }

  .container {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: flex-start;
    background: white;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  .body-display {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    background: var(--body-display-bg, #f8f9fa);
    border-radius: 12px;
    transition: background 0.3s ease;
  }

  .controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 300px;
    max-width: 350px;
  }

  .control-group {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .control-group h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.1rem;
  }

  .header-with-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .header-with-action h3 {
    margin: 0;
  }

  .clear-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: background 0.2s;
  }

  .clear-btn:hover {
    background: #c0392b;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 0.5rem;
    transition: background 0.2s;
  }

  .toggle:hover {
    background: #e9ecef;
  }

  .toggle input[type="checkbox"] {
    width: 40px;
    height: 20px;
    cursor: pointer;
  }

  .toggle span {
    color: #555;
    font-size: 0.95rem;
  }

  .toggle strong {
    color: #667eea;
    text-transform: capitalize;
  }

  .empty-state {
    color: #999;
    font-style: italic;
    text-align: center;
    padding: 1rem;
  }

  .selected-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
  }

  .selected-list li {
    padding: 0.75rem;
    background: white;
    margin-bottom: 0.5rem;
    border-radius: 8px;
    font-size: 0.9rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .part-name {
    font-weight: 600;
    color: #333;
    text-transform: capitalize;
    flex: 1;
  }

  .part-side {
    color: #667eea;
    font-size: 0.85rem;
  }

  .part-intensity {
    color: #999;
    font-size: 0.85rem;
  }

  .instructions {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .instructions li {
    padding: 0.5rem 0;
    color: #666;
    font-size: 0.9rem;
    position: relative;
    padding-left: 1.5rem;
  }

  .instructions li::before {
    content: "→";
    position: absolute;
    left: 0;
    color: #667eea;
    font-weight: bold;
  }

  .info-text {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .info-text code {
    background: #e9ecef;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 0.85rem;
    color: #667eea;
  }

  .css-example {
    background: #2d3436;
    border-radius: 6px;
    padding: 1rem;
    overflow-x: auto;
  }

  .css-example pre {
    margin: 0;
  }

  .css-example code {
    color: #a8e6cf;
    font-family: 'Courier New', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .footer {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
  }

  .footer p {
    color: white;
    font-size: 0.95rem;
  }

  .footer a {
    color: white;
    text-decoration: none;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .footer a:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 968px) {
    .container {
      flex-direction: column;
      align-items: center;
    }

    .controls {
      max-width: 100%;
      width: 100%;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>
