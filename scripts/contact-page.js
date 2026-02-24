const { createApp } = Vue;

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    return await response.json();
}

createApp({
    data() {
        return {
            contacts: [],
            loading: true,
            error: null
        };
    },
    async mounted() {
        try {
            this.contacts = await loadJson('scripts/data/contact.json');
        } catch (e) {
            console.error(e);
            this.error = 'Failed to load contact data.';
        } finally {
            this.loading = false;
        }
    }
}).mount('#app');