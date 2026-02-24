const { createApp } = Vue;

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    return await response.json();
}

createApp({
    data() {
        return {
            team: [],
            loading: true,
            error: null
        };
    },
    async mounted() {
        try {
            this.team = await loadJson('scripts/data/team.json');
        } catch (e) {
            console.error(e);
            this.error = 'Failed to load team data.';
        } finally {
            this.loading = false;
        }
    }
}).mount('#app');