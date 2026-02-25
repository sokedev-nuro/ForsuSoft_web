const { createApp } = Vue;

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    return await response.json();
}

createApp({
    data() {
        return {
            tools: [],
            loading: true,
            error: null,
            activeCategory: 'All'
        };
    },
    computed: {
        categories() {
            const cats = ['All', ...new Set(this.tools.map(t => t.category))];
            return cats;
        },
        filteredTools() {
            if (this.activeCategory === 'All') return this.tools;
            return this.tools.filter(t => t.category === this.activeCategory);
        }
    },
    async mounted() {
        try {
            this.tools = await loadJson('scripts/data/tools.json');
        } catch (e) {
            console.error(e);
            this.error = 'Failed to load tools.';
        } finally {
            this.loading = false;
        }
    }
}).mount('#app');