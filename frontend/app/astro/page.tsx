import AstroNavigator from '@/components/innovations/astro_navigator'

export const metadata = {
  title: 'LOGOS Astro Navigator - Ancient Star Catalog Analysis',
  description: 'Analyze ancient star catalogs using modern Gaia DR3 astrometry to determine observation epochs and detect catalog copying.',
}

export default function AstroNavigatorPage() {
  return <AstroNavigator />
}
