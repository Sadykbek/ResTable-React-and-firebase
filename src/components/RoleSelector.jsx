import React from 'react';
import { useRole } from './RoleContext';

const RoleSelector = () => {
  const { setRole } = useRole();

  return (
    <select className='outline outline-1 outline-gray-400 px-4 py-2 mt-6  text-cyan-800 bg-slate-200 rounded-md' onChange={(e) => setRole(e.target.value)}>
      <option value="viewer">Просмотрщик</option>
      <option value="editor">Редактор</option>
      <option value="admin">Администратор</option>
      <option value="organizer">Организатор</option>
    </select>
  );
};

export default RoleSelector;
