/** JSON for <script type="application/ld+json">: "<" is escaped so content can never close the tag. */
export const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
