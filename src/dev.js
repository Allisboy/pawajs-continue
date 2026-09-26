export const reportContinueError = (error, details = {}) => {
    const message = error instanceof Error ? error.message : String(error)
    const stack = error instanceof Error ? error.stack : undefined
    const dev = globalThis.__pawaDev

    const payload = {
        msg: details.msg || message,
        stack: details.stack || stack,
        effect: details.effect || 'hydration',
        ref: details.ref || null,
        exp: details.exp || null,
        directives: details.directives || null,
        template: details.template || null,
        warn: details.warn || null,
    }

    if (dev?.setError) {
        dev.setError(payload)
    } else {
        console.error(`[pawa:continue] ${payload.effect}`, error)
    }

    return payload
}
