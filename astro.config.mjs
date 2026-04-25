import { defineConfig, envField } from 'astro/config'

export default defineConfig({
    site: 'https://andikayopr.github.io',
    env: {
        schema: {
            PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
                context: 'client',
                access: 'public',
                optional: true, // This is key! It keeps the build from failing if the secret is empty
            }),
        },
    },
    // This handles the new Font component error
    experimental: {
        fonts: [],
    },
})