import { Wand2 } from 'lucide-react';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col border-b border-slate-200 pb-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
          <Wand2 size={20} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
      </div>
      <p className="text-slate-500 ml-1">{subtitle}</p>
    </div>
  );
};

export default PageHeader;