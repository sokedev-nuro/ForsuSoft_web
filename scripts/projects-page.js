const { createApp } = Vue;

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return await response.json();
}

createApp({
  data() {
    return {
      projects: [],
      loading: true,
      error: null
    };
  },
  async mounted() {
    try {
      const data = await loadJson('scripts/data/projects.json');
      this.projects = data;
    } catch (e) {
      console.error(e);
      this.error = 'Failed to load projects';
    } finally {
      this.loading = false;
    }
  }
}).mount('#app');