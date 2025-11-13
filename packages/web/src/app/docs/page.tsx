import DocsHomePage from '../[lang]/docs/page'

async function DocsHomePageWrapper() {
  return <DocsHomePage params={Promise.resolve({ lang: 'en' })} />
}

export default DocsHomePageWrapper
