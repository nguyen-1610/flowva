'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import ProjectSelector from './ProjectSelector';

const ProjectSelectorWrapper: React.FC = () => {
  const router = useRouter();

  return <ProjectSelector onSelectProject={() => router.push('/dashboard')} />;
};

export default ProjectSelectorWrapper;
