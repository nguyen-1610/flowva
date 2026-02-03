'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, MoreHorizontal, Plus, Shield } from 'lucide-react';
import { cn } from '@/frontend/lib/utils';
import { getMockAvatar } from '@/frontend/lib/avatar-utils';

const MembersView: React.FC = () => {
  const members = [
    {
      id: 1,
      name: 'Alex Designer',
      role: 'Lead Designer',
      email: 'alex@flowva.com',
      status: 'Online',
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'UX Researcher',
      email: 'sarah@flowva.com',
      status: 'In Meeting',
    },
    { id: 3, name: 'John Doe', role: 'Frontend Dev', email: 'john@flowva.com', status: 'Offline' },
    {
      id: 4,
      name: 'Emily Chen',
      role: 'Product Manager',
      email: 'emily@flowva.com',
      status: 'Online',
    },
    { id: 5, name: 'Mike Ross', role: 'Backend Dev', email: 'mike@flowva.com', status: 'Offline' },
  ];

  return (
    <div className="h-full flex-1 overflow-y-auto bg-white p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Team Members</h2>
          <p className="mt-1 text-sm text-slate-500">Manage project access and roles</p>
        </div>
        <button className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
          <Plus size={16} /> Invite Member
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Role
              </th>
              <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {members.map((member) => (
              <tr key={member.id} className="group transition-colors hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={getMockAvatar(member.id)}
                      alt={member.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <Shield size={12} /> {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                      member.status === 'Online'
                        ? 'bg-green-100 text-green-700'
                        : member.status === 'In Meeting'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        member.status === 'Online'
                          ? 'bg-green-500'
                          : member.status === 'In Meeting'
                            ? 'bg-purple-500'
                            : 'bg-slate-400',
                      )}
                    ></span>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600">
                      <Mail size={16} />
                    </button>
                    <button className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersView;
