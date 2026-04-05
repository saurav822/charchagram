'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to blog list page
    router.replace('/blog/list');
  }, [router]);

  return null;
}
