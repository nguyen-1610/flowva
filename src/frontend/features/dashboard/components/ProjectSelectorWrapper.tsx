'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectSelector from './ProjectSelector';

const ProjectSelectorWrapper: React.FC<{ userName?: string }> = ({ userName }) => {
  const router = useRouter();

  return <ProjectSelector userName={userName} onSelectProject={() => router.push('/dashboard')} />;
};

export default ProjectSelectorWrapper;
