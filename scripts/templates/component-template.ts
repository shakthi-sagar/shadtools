export function getComponentTemplate(componentName: string): string {
  return `import React from 'react';

export const ${componentName}: React.FC = () => {
  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-100">
      ${componentName} Tool
    </div>
  );
};

export default ${componentName};
`;
}
