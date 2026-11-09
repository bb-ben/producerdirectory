# Clear Meals Producer Directory

A read-only dashboard for the World Federation for Animals producer directory
snapshot dated November 6, 2026. Browse food categories, product groups and
certification programs before opening individual records. You can also search
the entire directory, filter and export results, and inspect the source links.

The dashboard runs in the browser without an account, OAuth, API keys, or a
database. The archive includes the editable source, the directory snapshot, and
the built site. Private workspace notes, saved decisions, and the original
internal research package are outside this export.

## Open or publish the site

Extract the ZIP, then open `index.html` at the top level. It opens
`docs/index.html`, which includes the app, styles, and data in one file and also
works when opened directly. External source links require internet access.

To publish to GitHub Pages, push the extracted folder to your repository,
then go to **Settings → Pages**. Under **Build and deployment**, select
**Deploy from a branch**, choose `main` (or the branch you pushed) and
`/docs`, then save. Pages serves the checked-in build directly.

For a new, empty GitHub repository, run these commands inside the extracted
folder, replacing the remote URL with your own:

```sh
git init -b main
git add .
git commit -m "Add Clear Meals producer directory"
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

## Edit and rebuild

Use Node.js 22.13 or newer and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev         # opens /dev.html for live editing
pnpm check
pnpm build
```

- `src/app/` contains the dashboard, category explorer, and styles.
- `src/lib/directory-taxonomy.ts` defines the category and product mappings.
- `src/data/directory.json` contains the November 6 snapshot.
- `docs/` is the built site. After changes, run `pnpm build` and commit
  the updated `docs/index.html` along with the source changes.

The data describes 784 provisional records grouped from 802 source entries,
not a list of 784 confirmed certified farms. Check the original listing for
certification scope and current status. Confirm source reuse permissions before
making the snapshot public.
