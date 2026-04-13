import { useEffect } from 'react';

export default function SEO({ title, description, schema }) {
  useEffect(() => {
    document.title = title ? `${title} | MediPharm Karaikal` : 'MediPharm | Karaikal\'s Premium Digital Pharmacy Enclave';
    
    // Manage Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description || 'Access doctors, medicines, and diagnostic services across Karaikal district with rapid 15-minute clinical synchronization.';

    // Managed JSON-LD Schema
    if (schema) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    }
  }, [title, description, schema]);

  return null;
}
