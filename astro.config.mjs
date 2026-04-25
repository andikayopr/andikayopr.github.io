import { defineConfig, envField } from 'astro/config'

export default defineConfig({
    site: 'https://andikayopr.github.io',
    experimental: {
        env: {
            schema: {
                PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
                    context: 'client',
                    access: 'public',
                    optional: true, // This prevents it from crashing if the value is missing
                }),
            },
        },
    },
})