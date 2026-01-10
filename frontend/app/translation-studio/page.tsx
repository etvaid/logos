import TranslationStudio from '@/components/TranslationStudio';

export default function TranslationStudioPage() {
  // Use a sample URN - in production this would come from URL params or selection
  const sampleUrn = 'local:1002139';

  return <TranslationStudio urn={sampleUrn} />;
}
