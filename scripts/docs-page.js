const { createApp } = Vue;

let _embedPDFLib = null;
let _embedInstance = null;

async function getEmbedPDF() {
    if (!_embedPDFLib) {
        const mod = await import('https://cdn.jsdelivr.net/npm/@embedpdf/snippet@2/dist/embedpdf.js');
        _embedPDFLib = mod.default;
    }
    return _embedPDFLib;
}

async function loadJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);
    return await response.json();
}

createApp({
    data() {
        return {
            docs: [],
            selectedDoc: null,
            loading: true,
            error: null,
            sidebarOpen: false,
            viewerLoading: false
        };
    },

    computed: {
        groupedDocs() {
            const groups = {};
            for (const doc of this.docs) {
                const key = doc.project || 'General';
                if (!groups[key]) groups[key] = [];
                groups[key].push(doc);
            }
            return Object.entries(groups).map(([project, docs]) => ({ project, docs }));
        }
    },

    methods: {
        async selectDoc(doc) {
            if (this.selectedDoc?.id === doc.id) return;
            this.selectedDoc = doc;
            this.sidebarOpen = false;
            this.viewerLoading = true;
            await this.$nextTick();
            await this.mountViewer(doc.file);
        },

        async mountViewer(src) {
            try {
                // Destroy previous instance if supported
                if (_embedInstance && typeof _embedInstance.destroy === 'function') {
                    _embedInstance.destroy();
                }

                // Clear the container manually to reset EmbedPDF DOM
                const container = document.getElementById('embedpdf-container');
                container.innerHTML = '';

                const EmbedPDF = await getEmbedPDF();

                _embedInstance = EmbedPDF.init({
                    type: 'container',
                    target: container,
                    src,
                    theme: {
                        preference: 'dark'
                    }
                });
            } catch (e) {
                console.error('EmbedPDF error:', e);
            } finally {
                this.viewerLoading = false;
            }
        }
    },

    async mounted() {
        try {
            this.docs = await loadJson('scripts/data/docs.json');
            if (this.docs.length > 0) {
                await this.$nextTick();
                await this.selectDoc(this.docs[0]);
            }
        } catch (e) {
            console.error(e);
            this.error = 'Failed to load document list';
        } finally {
            this.loading = false;
        }
    }
}).mount('#app');