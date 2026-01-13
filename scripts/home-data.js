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
      news: [],
      projects: [],
      loading: true,
      error: null
    };
  },
  computed: {
    featuredProjects() {
      return this.projects.filter(p => p.featured);
    }
  },
  async mounted() {
    try {
      const [newsData, projectsData] = await Promise.all([
        loadJson('scripts/data/news.json'),
        loadJson('scripts/data/projects.json')
      ]);
      this.news = newsData;
      this.projects = projectsData;
    } catch (e) {
      console.error(e);
      this.error = 'Failed to load data';
    } finally {
      this.loading = false;
    }
  }
}).mount('#app');