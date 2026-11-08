import type { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { stageLabel } from '@/lib/crm-model';

export function CrmModal({open,onOpenChange,title,description,children}: {open:boolean;onOpenChange:(open:boolean)=>void;title:string;description:string;children:ReactNode}) {
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="crm-modal"><DialogTitle>{title}</DialogTitle><DialogDescription>{description}</DialogDescription><div className="crm-ui">{children}</div></DialogContent></Dialog>;
}
export function FormField({label,children,wide=false}: {label:string;children:ReactNode;wide?:boolean}) {
  return <label className={'crm-form-field'+(wide?' crm-wide':'')}><span>{label}</span>{children}</label>;
}
export function Field({label,value}: {label:string;value:string|null}) {
  return <div className="crm-field"><dt>{label}</dt><dd>{value || '—'}</dd></div>;
}
export function Stage({value}: {value:string}) {return <span className={'crm-stage '+(['ganado','cita_agendada'].includes(value)?'crm-stage-positive':'')}>{stageLabel(value)}</span>;}